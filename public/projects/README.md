# Project screenshots

Drop one image per project here, then point `content/projects.ts` at it:

    image: "/projects/nonamart.png",

Expected slugs: `nonamart`, `24-ghanta-nepal`, `pana-productions`,
`parivar`, `krishi-saathi`.

The crop is unforgiving of a shot that isn't 16:10: a wider one loses its edges,
which is where a site tends to keep its logo and its header button. Pad a wide
shot to 16:10 rather than letting the frame centre-crop it.

Cards render the image at a 16:10 crop anchored to the top, so aim for a wide
shot of the actual interface — roughly 1600×1000, PNG or WebP. Until a project
has an `image`, its card shows a lettered placeholder instead.
