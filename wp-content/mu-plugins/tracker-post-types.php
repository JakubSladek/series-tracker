<?php

function tracker_post_types() {
    register_post_type('update', array(
        'capability_type' => 'update',
        'map_meta_cap' => true,
        'supports' => array('title', 'editor', 'excerpt', 'thumbnail'),
        'rewrite' => array('slug' => 'updates'),
        'has_archive' => true,
        'public' => true,
        'labels' => array(
            'name' => 'Updates',
            'add_new_item' => 'Add New Update',
            'edit_item' => 'Edit Update',
            'all_items' => 'All Updates',
            'singular_name' => 'Update'
        ),
        'menu_icon' => 'dashicons-cloud-upload',
    ));

    register_post_type('series', array(
        'capability_type' => 'series',
        'map_meta_cap' => true,
        'show_in_rest' => true,
        'supports' => array('title', 'editor'),
        'public' => false,
        'show_ui' => true,
        'labels' => array(
            'name' => 'Series',
            'add_new_item' => 'Add New Series',
            'edit_item' => 'Edit Series',
            'all_items' => 'All Series',
            'singular_name' => 'Series'
        ),
        'menu_icon' => 'dashicons-sort',
    ));
}

add_action('init', 'tracker_post_types');
