import { defineField, defineType } from "sanity"

export const rug = defineType({
    name: "rug",
    title: "Rug / Carpet",
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
            name: "description",
            title: "Description",
            type: "text",
        }),
        defineField({
            name: "price",
            title: "Price (Formatted)",
            type: "string",
            description: "e.g., 'From $14,400'",
        }),
        defineField({
            name: "priceUSD",
            title: "Price (USD)",
            type: "number",
            description: "Numeric price in USD for sorting and filtering",
        }),
        defineField({
            name: "image",
            title: "Primary Image",
            type: "image",
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "images",
            title: "Gallery Images",
            type: "array",
            of: [{ type: "image", options: { hotspot: true } }],
            description: "Additional detail or layout images of the rug / carpet",
        }),
        defineField({
            name: "materials",
            title: "Materials",
            type: "string",
            description: "e.g., 'Wool, Silk highlights'",
        }),
        defineField({
            name: "dimensions",
            title: "Dimensions",
            type: "string",
            description: "e.g., '8 × 10'",
        }),
        defineField({
            name: "knotDensity",
            title: "Knot Density",
            type: "string",
            description: "e.g., '12–16 per inch²'",
        }),
        defineField({
            name: "weaveTime",
            title: "Weave Time",
            type: "string",
            description: "e.g., '8–12 months'",
        }),
        defineField({
            name: "colors",
            title: "Colors",
            type: "array",
            of: [{ type: "string" }],
            options: {
                layout: "tags",
            },
            description: "Color tags for filtering on the website",
        }),
        defineField({
            name: "hubspotFormId",
            title: "HubSpot Form ID",
            type: "string",
            description: "Optional ID for a specific HubSpot form for this rug",
        }),
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "price",
            media: "image",
        },
    },
})
