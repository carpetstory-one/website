import { defineField, defineType } from "sanity"

export const collection = defineType({
    name: "collection",
    title: "Collection",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "tagline",
            title: "Tagline",
            type: "string",
            description: "A short, engaging hook for the collection",
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            description: "A detailed description of the collection's style, history, and craft",
        }),
        defineField({
            name: "heroImage",
            title: "Hero Image",
            type: "image",
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "featured",
            title: "Featured",
            type: "boolean",
            description: "Show this collection on the homepage",
            initialValue: false,
        }),
        defineField({
            name: "meta",
            title: "Collection Metadata",
            type: "object",
            fields: [
                defineField({
                    name: "origin",
                    title: "Origin",
                    type: "string",
                    initialValue: "Jaipur, Rajasthan",
                }),
                defineField({
                    name: "materials",
                    title: "Materials",
                    type: "string",
                }),
                defineField({
                    name: "knotDensity",
                    title: "Knot Density",
                    type: "string",
                }),
                defineField({
                    name: "leadTime",
                    title: "Lead Time / Weave Time",
                    type: "string",
                }),
                defineField({
                    name: "hubspotFormId",
                    title: "HubSpot Form ID",
                    type: "string",
                    description: "Optional ID for a specific HubSpot form for this collection",
                }),
            ],
        }),
        defineField({
            name: "rugs",
            title: "Rugs / Carpets",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{ type: "rug" }],
                    options: {
                        filter: ({ document }) => {
                            const documentId = document?._id || "";
                            const publishedId = documentId.replace(/^drafts\./, "");
                            return {
                                filter: `count(*[_type == "collection" && _id != $currentId && _id != $draftCurrentId && (references(^._id) || references(string::split(^._id, "drafts.")[1]))]) == 0`,
                                params: {
                                    currentId: publishedId,
                                    draftCurrentId: `drafts.${publishedId}`,
                                },
                            };
                        },
                    },
                },
            ],
            description: "Associate rugs/carpets with this collection",
        }),
    ],
    preview: {
        select: {
            title: "title",
            media: "heroImage",
        },
    },
})
