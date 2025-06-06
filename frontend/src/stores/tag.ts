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
      try {
        this.tags = await tagApi.getList()
      } catch (error) {
        console.error('Failed to fetch tags:', error)
        this.error = '获取标签列表失败'
      } finally {
        this.loading = false
      }
    },

    async createTag(tag: Omit<TagData, 'id' | 'createdAt'>) {
      this.loading = true
      this.error = null
      try {
        const newTag = await tagApi.create(tag)
        this.tags.push(newTag)
        return newTag
      } catch (error) {
        console.error('Failed to create tag:', error)
        this.error = '创建标签失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTag(id: string, tag: Partial<TagData>) {
      this.loading = true
      this.error = null
      try {
        const updatedTag = await tagApi.update(id, tag)
        const index = this.tags.findIndex(t => t.id === id)
        if (index !== -1) {
          this.tags[index] = updatedTag
        }
        return updatedTag
      } catch (error) {
        console.error('Failed to update tag:', error)
        this.error = '更新标签失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTag(id: string) {
      this.loading = true
      this.error = null
      try {
        await tagApi.delete(id)
        this.tags = this.tags.filter(tag => tag.id !== id)
      } catch (error) {
        console.error('Failed to delete tag:', error)
        this.error = '删除标签失败'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 