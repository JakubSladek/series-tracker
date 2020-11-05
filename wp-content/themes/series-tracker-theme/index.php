<?php
get_header(); 
pageBanner(array(
    'title' => 'Welcome to our blog!',
    'subtitle' => 'Keep up with our latest news.'
));
?>

<div class="container container--narrow page-section">
    <?php
    while (have_posts()) {
        the_post(); ?>

        <div class="post-item">
            <h2 class="headline headline--medium headline--post-title"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></h2>

            <div class="metabox">
                <p>Posted by <?php the_author_posts_link(); ?> on <a href="<?php echo site_url(get_the_time('n/d/y')); ?>"><?php the_time('n.j.y'); ?></a> in <?php the_category(','); ?></p>
            </div>

            <div class="generic-content">
                <?php echo wp_trim_words(get_the_excerpt(), 46, '....'); ?>
                <p class=""><a class="btn btn--blue" href="<?php the_permalink(); ?>">Continue reading &raquo;</a></p>
            </div>
        </div>

    <?php } ?>
    <?php echo paginate_links(); ?>
</div>

<?php get_footer(); ?>