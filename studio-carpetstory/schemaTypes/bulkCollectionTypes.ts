import { defineField, defineType } from "sanity"
import { MultiImageUpload } from "../components/MultiImageUpload"

export const bulkCollection = defineType({
    name: "bulkCollection",
    title: "Bulk Collection",
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
            name: "rugImages",
            title: "Rug Images (Bulk Upload)",
            type: "array",
            of: [
                {
                    type: "image",
                    options: { hotspot: true },
                    fields: [
                        defineField({
                            name: "sku",
                            title: "SKU / Identifier",
                            type: "string",
                            description: "Optional: Specific SKU or name for this rug. If left blank, a name based on the collection title and index will be used.",
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
                    ]
                }
            ],
            options: {
                layout: 'grid',
            },
            components: {
                input: MultiImageUpload
            },
            description: "Drag and drop multiple images here, or use the multiselect button below to add all rugs at once.",
        }),
    ],
    preview: {
        select: {
            title: "title",
            media: "heroImage",
        },
    },
})
