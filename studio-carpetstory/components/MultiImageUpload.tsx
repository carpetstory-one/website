import React, { useCallback, useState } from 'react'
import { ArrayOfObjectsInputProps, setIfMissing, insert, useClient } from 'sanity'
import { Button, Box, Stack, Text, Flex } from '@sanity/ui'
import { UploadIcon } from '@sanity/icons'

export function MultiImageUpload(props: ArrayOfObjectsInputProps) {
  const { onChange, renderDefault } = props
  const client = useClient({ apiVersion: '2023-05-01' })
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)
    try {
      // Upload all files in parallel
      const uploads = files.map(file => client.assets.upload('image', file))
      const assets = await Promise.all(uploads)
      
      // Map assets to the expected image object structure
      const newItems = assets.map(asset => ({
        _type: 'image',
        _key: Math.random().toString(36).substring(2, 9),
        asset: {
          _type: 'reference',
          _ref: asset._id
        }
      }))

      // Patch the array with the new items
      onChange(setIfMissing([]))
      onChange(insert(newItems, 'after', [-1]))
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Check the console for details.')
    } finally {
      setIsUploading(false)
      // Reset the input so the same files can be uploaded again if needed
      event.target.value = ''
    }
  }, [client, onChange])

  return (
    <Stack space={3}>
      {/* Render the default Sanity array input (which handles drag-and-drop and listing) */}
      {renderDefault(props)}
      
      {/* Add our custom multiselect button at the bottom */}
      <Box padding={3} style={{ border: '1px dashed var(--card-border-color)', borderRadius: '0.25rem', textAlign: 'center' }}>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileUpload} 
          style={{ display: 'none' }} 
          id="multi-upload-input"
        />
        <label htmlFor="multi-upload-input">
          <Button 
            as="span" 
            mode="ghost"
            icon={UploadIcon}
            text={isUploading ? "Uploading..." : "Click here to Select Multiple Images"} 
            disabled={isUploading}
            style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}
          />
        </label>
        {!isUploading && (
          <Box marginTop={3}>
            <Text size={1} muted>
              You can also drag and drop multiple files directly onto this area!
            </Text>
          </Box>
        )}
      </Box>
    </Stack>
  )
}
