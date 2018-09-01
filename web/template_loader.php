<?php
/*
 * Fetches a template from the backend so it's readable in public folder:
 * js/app/file/filebox.html.twig => src/AppBundle/Resources/views/File/filebox.html.twig
 *
 * If the middle part is missing, 'Default' path is used:
 * js/app/index.html.twig => src/AppBundle/Resources/views/index.html.twig
 */

// Regex replace any single character NOT in the set of English letters, numerals,
// any single character (the '.'), and the underscore.
$uri = preg_replace('/[^A-Za-z0-9\/\._]/', '', $_SERVER['REQUEST_URI']);
$parts = explode('/', $uri);

// Read examples above for explanation.
if (preg_match('/^.+twig$/', $parts[4]) === 1) {  // $uri: '/js/main/product/attribute.html.twig'
    $path = '../src/'.ucfirst($parts[2]).'Bundle/Resources/views/';
    $path .= ucfirst($parts[3]);
    $template = $parts[4];
} else if (preg_match('/^.+twig$/', $parts[5]) === 1) { // $uri: '/js/templates/main/product/attribute.html.twig'
    $path = '../src/'.ucfirst($parts[3]).'Bundle/Resources/views/';
    $path .= ucfirst($parts[4]);
    $template = $parts[5];
} else {
    $path = '../src/'.ucfirst($parts[2]).'Bundle/Resources/views/';
    $path .= 'Default';
    $template = $parts[3];
}

$path .= '/'.$template;

if (pathinfo($path, PATHINFO_EXTENSION) !== 'twig' && pathinfo($path, PATHINFO_EXTENSION) !== 'html') {
    http_response_code(404);
    exit;
}

$template = @file_get_contents($path);

if ($template === false) {
    http_response_code(404);
    exit;
}

echo $template;
