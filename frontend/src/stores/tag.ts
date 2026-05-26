import { defineStore } from 'pinia'
import { tagApi } from '@/api/tag'
import type { TagData } from '@/api/tag'
import dayjs from '@/utils/dayjs'

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
    isTemporaryTag(tag: TagData) {
      return tag.type === 'temporary'
    },

    isTagActiveOnDate(tag: TagData, date: string) {
      if (!this.isTemporaryTag(tag)) return true
      if (!tag.startDate || !tag.endDate) return false
      const targetDate = dayjs(date).startOf('day')
      return (
        targetDate.isSame(dayjs(tag.startDate).startOf('day')) ||
        targetDate.isSame(dayjs(tag.endDate).startOf('day')) ||
        (targetDate.isAfter(dayjs(tag.startDate).startOf('day')) && targetDate.isBefore(dayjs(tag.endDate).startOf('day')))
      )
    },

    getSelectableTags(date: string, selectedTagIds: string[] = []) {
      const selectedSet = new Set(selectedTagIds)
      return this.tags.filter(tag => {
        if (tag.archived) return selectedSet.has(tag.id)
        if (!this.isTemporaryTag(tag)) return true
        return this.isTagActiveOnDate(tag, date) || selectedSet.has(tag.id)
      })
    },

    getAutoApplyTags(date: string) {
      return this.tags.filter(tag => !tag.archived && tag.type === 'temporary' && tag.autoApply !== false && this.isTagActiveOnDate(tag, date))
    },

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
