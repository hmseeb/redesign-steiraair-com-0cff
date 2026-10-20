# Steira Air — Website

Static website for **Steira Air**, "Your Healthy Environment Specialist" — indoor air quality
monitoring, chemical-free steam coil cleaning, duct cleaning and HVAC maintenance for residential,
commercial and government facilities (Atlanta, GA · Dallas, TX · nationwide).

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no dependencies, no environment variables.
Serve the repository root as a static site; `index.html` is the entry point.

```
python3 -m http.server 8000
```

## Structure

```
index.html                                  Home
about-us/                                   About Steira Air
contact-us-snellville-united-states/        Contact + quote form
indoor-air-quality-snellville-united-states/
cam-systems-snellville-united-states/
commercial-snellville-united-states/        Commercial overview
residential-snellville-united-states/       Residential overview
steam-coil-cleaning-.../                    Service pages
enzyme-36-coil-cleaning-.../
air-cooled-chiller-steam-cleaning-.../
cmms-.../ cooling-tower-chillers-.../
duct-cleaning-.../ pressure-washing-.../
mold-services-.../ preventive-maintenance-.../
privacy-policy-for-steira-air/  terms-and-conditions/
404.html  robots.txt  sitemap.xml  favicon.svg
css/style.css   js/main.js   images/source/
```

## Forms

Both forms (home quote request, contact page) POST to the LeadrVision endpoint with hidden
`_form`, `_page` and `_gotcha` fields. JavaScript upgrades them to a `fetch()` submission with an
inline confirmation; without JavaScript they submit normally and the visitor returns with
`?submitted=1`, which also renders the confirmation.

`/review` is linked from the footer of every page and from the testimonials and contact sections.
That route is provided by the hosting platform and is intentionally not defined in this repository.
