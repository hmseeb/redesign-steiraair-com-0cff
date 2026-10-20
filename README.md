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
index.html                      Single-page site: hero, why us, devices, steam
                                cleaning, service comparison, commercial,
                                residential, testimonials, FAQ, contact + quote
404.html  robots.txt  sitemap.xml  favicon.svg
css/style.css   js/main.js   images/source/
```

Navigation is anchor based (`#why`, `#devices`, `#steam`, `#services`, `#residential`,
`#faq`, `#contact`, `#quote`).

## Forms

The quote request form POSTs to the LeadrVision endpoint with hidden
`_form`, `_page` and `_gotcha` fields. JavaScript upgrades it to a `fetch()` submission with an
inline confirmation; without JavaScript it submits normally and the visitor returns with
`?submitted=1`, which also renders the confirmation.

`/review` is linked from the footer and from the testimonials and contact sections.
That route is provided by the hosting platform and is intentionally not defined in this repository.
