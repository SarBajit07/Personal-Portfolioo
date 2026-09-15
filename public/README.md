# public/

## The hero photo

The home page looks for the first of these that exists, and renders a plain
monogram if none do:

    public/sarbajit.jpg
    public/sarbajit.jpeg
    public/sarbajit.png

Save the photo under one of those names and refresh — no code change needed.

Notes on the crop: the frame is 4:5 and the image is cropped `cover`, anchored
at `50% 20%` so the face stays in frame as the column narrows. A portrait-
orientation source of roughly 900x1200 or larger is ideal. If the crop cuts
badly, adjust `object-position` on `.portrait img` in `app/globals.css`.

## The CV

    public/Sarbajit-Timalsina-Resume.pdf

Served at `/Sarbajit-Timalsina-Resume.pdf` and linked from the hero and the
contact page. The path is set once in `lib/site.ts` (`resume`), so renaming the
file means editing that one constant rather than hunting for anchors.

It is generated from a standalone `resume.html` — a single-column, ATS-parseable
layout with no images or tables, so a résumé parser extracts real text rather
than a picture of it. That source is deliberately **not** in this repo, since it
is a document build rather than part of the site. It lives at:

    ../resume-source/resume.html

To regenerate after editing it, from the project root:

    chrome --headless=new --no-pdf-header-footer \
      --print-to-pdf="public/Sarbajit-Timalsina-Resume.pdf" \
      ../resume-source/resume.html

Write it straight into `public/` as above — that is the only copy the site
serves, and a second copy elsewhere is how the served one goes stale. If the
source ever goes missing, the PDF is still fine to ship; it just cannot be
edited without rebuilding the HTML.

## Project screenshots

See `public/projects/README.md`.
