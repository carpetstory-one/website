import {defineType, defineField} from 'sanity'

/**
 * articleImages
 * Holds ONLY the images for one rug article.
 * Images upload to and are served from the Sanity CDN (cdn.sanity.io).
 * Everything else (title, alt text, body, SEO) comes from the Markdown files
 * and is joined to this document by `translationKey`.
 */
export const articleImages = defineType({
  name: 'articleImages',
  title: 'Article Images',
  type: 'document',
  fields: [
    defineField({
      name: 'translationKey',
      title: 'Translation Key',
      type: 'string',
      description:
        'Must exactly match the translationKey in the Markdown frontmatter ' +
        '(e.g. "india-handknotted-pillar", "knot-density", "rug-care"). ' +
        'This is the join key between the article content and its images.',
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          if (!value) return 'Required'
          const {getClient, document} = context
          const client = getClient({apiVersion: '2024-01-01'})
          const id = document?._id?.replace(/^drafts\./, '')
          const params = {key: value, draft: `drafts.${id}`, published: id}
          const query =
            'count(*[_type == "articleImages" && translationKey == $key && !(_id in [$draft, $published])]) == 0'
          const isUnique = await client.fetch(query, params)
          return isUnique ? true : 'Another document already uses this translation key'
        }),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      description: 'Landscape hero, 16:9 (2400×1350). Uploaded to and served from the Sanity CDN.',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ogImage',
      title: 'OG / Social Image',
      type: 'image',
      description: 'Open Graph image, 1.91:1 (1200×630). Uploaded to and served from the Sanity CDN.',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'translationKey', media: 'heroImage'},
  },
})