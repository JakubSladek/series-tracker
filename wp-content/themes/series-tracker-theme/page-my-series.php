<?php

if (!is_user_logged_in()) {
    wp_redirect(esc_url(site_url('/')));
    exit;
}

get_header();

// Get series query
$userSeries = new WP_Query(array(
    'post_type' => 'series',
    'posts_per_page' => -1,
    'author' => get_current_user_id()
));

while (have_posts()) {
    the_post();
    pageBanner(array(
        'subtitle' => 'Tracking: <span id="tracked_series_count">' . getTrackedSeries($userSeries) . '</span> series'
    ));
?>
    <div class="container container--narrow page-section series-main">

        <!-- add series -->
        <a href="#add-series" class="btn btn--small btn-secondary" data-toggle="collapse">Add Series</a>

        <div id="add-series" class="create-note collapse">
            <h2 class="headline headline--medium">Add new series</h2>

            <sup class="se">
                <i class="fa fa-minus season-minus se-control se-control--active" aria-hidden="true"></i>
                S<span id="SEASON_NO">01</span>
                <i class="fa fa-plus season-plus se-control se-control--active" aria-hidden="true"></i>

                <i class="fa fa-minus episode-minus se-control se-control--active" aria-hidden="true"></i>
                E<span id="EPISODE_NO">01</span>
                <i class="fa fa-plus episode-plus se-control se-control--active" aria-hidden="true"></i>
            </sup>

            <input class="new-note-title" placeholder="Title">
            <textarea placeholder="Your note here..." class="new-note-body"></textarea>
            <span class="submit-note">Create</span>
        </div>

        <!-- search series -->
        <a href="#search-series" class="btn btn--small btn-primary" data-toggle="collapse">Search Series</a>

        <div id="search-series" class="active-cyan-3 active-cyan-4 mb-4 mt-2 collapse">
            <input class="form-control" type="text" placeholder="Search" aria-label="Search">
        </div>

        <ul class="min-list link-list" id="my-notes">

            <?php
            while ($userSeries->have_posts()) {
                $userSeries->the_post(); ?>

                <li data-id="<?php the_id(); ?>">

                    <sup class="se"> <i class="fa fa-minus season-minus se-control" aria-hidden="true"></i>
                        S<span id="SEASON_NO"><?php echo esc_attr(get_field('series_number')); ?></span>
                        <i class="fa fa-plus season-plus se-control" aria-hidden="true"></i>

                        <i class="fa fa-minus episode-minus se-control" aria-hidden="true"></i>
                        E<span id="EPISODE_NO"><?php echo esc_attr(get_field('episode_number')); ?></span>
                        <i class="fa fa-plus episode-plus se-control" aria-hidden="true"></i>
                    </sup>

                    <input readonly class="note-title-field" value="<?php echo str_replace('Private: ', '', esc_attr(get_the_title())); ?>">

                    <div class="d-sm-block d-md-inline">
                        <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
                        <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
                        <span class="copy-note"><i class="fa fa-copy" aria-hidden="true"></i> Copy</span>
                    </div>

                    <textarea readonly class="note-body-field"><?php echo wp_strip_all_tags(esc_textarea(get_the_content())); ?></textarea>
                    <span class="mt-1 update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"> Save</i></span>
                </li>

            <?php } ?>
        </ul>
    </div>

<?php } ?>

<?php get_footer(); ?>