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

## Project screenshots

See `public/projects/README.md`.
