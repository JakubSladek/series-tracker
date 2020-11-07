<?php

// custom rest fields
require get_theme_file_path('./inc/custom_rest_fields.php');

// page banner
function pageBanner($args = NULL) {
?>
    <div class="page-banner">
        <?php
        if (!$args['title']) $args['title'] = get_the_title();
        if (!$args['subtitle']) $args['subtitle'] = get_field('page_banner_subtitle');

        if (!$args['photo']) {
            if (get_field('page_banner_background_image') and !is_archive() and !is_home()) {
                $args['photo'] = get_field('page_banner_background_image')['sizes']['pageBanner'];
            } else {
                $args['photo'] = get_theme_file_uri('/images/ocean.jpg');
            }
        }
        ?>

        <div class="page-banner__bg-image" style="background-image: url(<?php echo $args['photo']; ?>)"></div>
        <div class="page-banner__content container container--narrow">
            <h1 class="page-banner__title"><?php echo $args['title']; ?></h1>
            <div class="page-banner__intro">
                <p><?php echo $args['subtitle']; ?></p>
            </div>
        </div>
    </div>
<?php }

// enqueue files & localize script
function tracker_files() {
    wp_enqueue_style('font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('custom-google-font', 'https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style('bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');

    wp_enqueue_script('jQuery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js', NULL, '3.5.1', true);
    wp_enqueue_script('bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js', NULL, '4.5.2', true);
    wp_enqueue_script('popper', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js', NULL, '1.16.0', true);

    // if running on localhost with bundled scripts compiled by node
    if (strstr($_SERVER['SERVER_NAME'], 'localhost')) {
        wp_enqueue_script('main-tracker-js', 'http://localhost:3000/bundled.js', NULL, '1.0', true);
    } else {
        wp_enqueue_script('our-vendors-js', get_theme_file_uri('/bundled-assets/vendors~scripts.8c97d901916ad616a264.js'), NULL, '1.0', true);
        wp_enqueue_script('main-university-js', get_theme_file_uri('/bundled-assets/scripts.27ad72884993804a44a1.js'), NULL, '1.0', true);
        wp_enqueue_style('our-main-styles', get_theme_file_uri('/bundled-assets/styles.27ad72884993804a44a1.css'));
    }

    // store creds to javascript var, for ajax rest api communication
    wp_localize_script('main-tracker-js', 'trackerData', array(
        'root_url' => get_site_url(),
        'nonce' => wp_create_nonce('wp_rest')
    ));
}

add_action('wp_enqueue_scripts', 'tracker_files');


// misc features
add_action('after_setup_theme', 'tracker_features');

function tracker_features() {
    register_nav_menu('headerMenuLocation', 'Header Menu Location');
    register_nav_menu('footerLocationOne', 'Footer Location One');
    register_nav_menu('footerLocationTwo', 'Footer Location Two');

    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');

    add_image_size('pageBanner', 1500, 350, true);
}

// Redirect subscribers account out of admin and onto homepage
add_action('admin_init', 'redirectSubsToFrontend');

function redirectSubsToFrontend() {
    $ourCurrentUser = wp_get_current_user();

    if (isSubOrBoost($ourCurrentUser)) {
        wp_redirect(site_url('/'));
        exit;
    }
}

add_action('wp_loaded', 'noSubsAdminBar');

function noSubsAdminBar() {
    $ourCurrentUser = wp_get_current_user();

    if (isSubOrBoost($ourCurrentUser)) show_admin_bar(false);
}

function isSubOrBoost($user) {
    if (count($user->roles) == 1 and $user->roles[0] == 'subscriber') return true;
    else if (count($user->roles) == 1 and $user->roles[0] == 'series_boost') return true;

    return false;
}


// Customize login screen
add_filter('login_headerurl', 'ourHeaderUrl');

function ourHeaderUrl() {
    return esc_url(site_url('/'));
}

add_action('login_enqueue_scripts', 'ourLoginCSS');

function ourLoginCSS() {
    wp_enqueue_style('our-main-styles', get_theme_file_uri('/bundled-assets/styles.27ad72884993804a44a1.css'));
    wp_enqueue_style('custom-google-font', 'https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
}

add_filter('login_headertext', 'customLoginHeaderText');

function customLoginHeaderText() {
    $headerText = get_bloginfo();
    return $headerText;
}

// get tracked series number
function getTrackedSeries($query = null) {
    if (!$query) {
        $query = new WP_Query(array(
            'post_type' => 'series'
        ));
    }

    $foundSeries = $query->found_posts;

    if ($query) return $foundSeries;

    return 0;
}

// Make series private & limit posts
add_filter('wp_insert_post_data', 'makeSeriesPrivate', 10, 2);

function makeSeriesPrivate($data, $postarr) {
    $user = wp_get_current_user();
    $reachedLimit = false;

    if ($data['post_type'] == 'series') {
        if (!$postarr['ID']) {

            // if is administrator (50 posts max)
            if (in_array('administrator', $user->roles)) {
                if (count_user_posts(get_current_user_id(), 'series') > 50)
                    $reachedLimit = true;
            
            // if has series_boost role (20 posts max)
            } else if (in_array('series_boost', $user->roles)) {
                if (count_user_posts(get_current_user_id(), 'series') > 20)
                    $reachedLimit = true;
            
            // limit other roles to 4 posts
            } else if (count_user_posts(get_current_user_id(), 'series') > 4)
                $reachedLimit = true;

            if ($reachedLimit) die("You have reached your series limit!");

            $data['post_content'] = sanitize_textarea_field($data['post_content']);
            $data['post_title'] = sanitize_text_field($data['post_title']);
        }
    }

    // always set to private if not moving to trash
    if ($data['post_type'] == 'series' and $data['post_status'] != 'trash') {
        $data['post_status'] = "private";
    }

    return $data;
}
