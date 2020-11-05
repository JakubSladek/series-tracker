<?php

get_header();
pageBanner(array(
    'title' => 'All Updates',
    'subtitle' => 'See what is going on in new updates.'
));
?>

<div class="container container--narrow page-section">
    <?php
    while (have_posts()) {
        the_post();
        get_template_part('template-parts/content-update');
    }
    
    echo paginate_links(); ?>
</div>

<?php get_footer(); ?>