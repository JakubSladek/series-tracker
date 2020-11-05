<?php
function custom_rest_fields() {
    
// count tracked series of user
register_rest_field('series', 'tracked_series', array(
    'get_callback' => function () {
        return count_user_posts(get_current_user_id(), 'series');
    },
    'update_callback' => null,
    'schema' => null
));

// ACF Series & Episodes
register_rest_field('series', 'series_number', array(
    'get_callback' => function () {
        if (!get_field('episode_number')) return 0;
        return get_field('series_number');
    },
    'update_callback' => function ($value, $object, $fieldName) {
        if (is_nan($value)) die("ERROR! Series must be a number!");
        return update_post_meta($object->ID, $fieldName, $value);
    },
    'schema' => null
));

register_rest_field('series', 'episode_number', array(
    'get_callback' => function () {
        if (!get_field('episode_number')) return 0;
        return get_field('episode_number');
    },
    'update_callback' => function ($value, $object, $fieldName) {
        if (is_nan($value)) die("ERROR! Episode must be a number!");
        return update_post_meta($object->ID, $fieldName, $value);
    },
    'schema' => null
));
}

add_action('rest_api_init', 'custom_rest_fields');