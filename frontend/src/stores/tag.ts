import { defineStore } from 'pinia'
import { tagApi } from '@/api/tag'
import type { TagData } from '@/api/tag'

interface TagState {
  tags: TagData[]
  loading: boolean
  error: string | null
}

export const useTagStore = defineStore('tag', {
  state: (): TagState => ({
    tags: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchTags() {
      this.loading = true
      this.error = null
      this.tags = await tagApi.getList()
      this.loading = false
    },

    async createTag(tag: Omit<TagData, 'id' | 'createdAt'>) {
      this.loading = true
      this.error = null
      const newTag = await tagApi.create(tag)
      this.tags.push(newTag)
      this.loading = false
      return newTag
    },

    async updateTag(id: string, tag: Partial<TagData>) {
      this.loading = true
      this.error = null
      const updatedTag = await tagApi.update(id, tag)
      const index = this.tags.findIndex(t => t.id === id)
      if (index !== -1) {
        this.tags[index] = updatedTag
      }
      this.loading = false
      return updatedTag
    },

    async deleteTag(id: string) {
      this.loading = true
      this.error = null
      await tagApi.delete(id)
      this.tags = this.tags.filter(tag => tag.id !== id)
      this.loading = false
    }
  }
}) 