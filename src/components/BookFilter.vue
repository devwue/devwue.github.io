<template>
	<div class='root'>
		<p> Showing {{ filteredTitles.length }} results for "{{ query }}" </p>
		<ul>
			<li v-for='title in paginatedTitles' :key='title.Page'>
        <a :href="'/posts' + cleanName(title.Page)">{{ title.Name }}</a>
			</li>
		</ul>
    <paginate
      :page-count="totalPages"
      :click-handler="paginatedAction"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'" :page-class="'page-item'"
      />
	</div>
</template>
<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Paginate from 'vuejs-paginate-next'
import techStory from '../post-data.json'
import lifeStory from '../life-data.json'
export default {
	props: {
		query: String
	},
  components: {
    Paginate
  },
  methods: {
    cleanName(markdownName) {
      return markdownName.replace(/\.md$/,'')
    }
  },
	setup (props, context) {
    const currentPage = ref(1)
    const perPage = 10
    const route = useRoute()

    watch(() => route.path, (newPath) => {
      currentPage.value = 1
    })

    const titles = computed(() => {
      const category = route.meta?.category;
      return category === 'life' ? lifeStory : techStory;
    })

		onMounted(() => {
			//console.log('BookFilter mounted. Current path:', route.path, 'meta:', route.meta)
		})

		const filteredTitles = computed(() => {
			const dataToFilter = Array.isArray(titles.value) ? titles.value : [];
			if (!props.query) {
				//console.log("Filtered Titles (no query):", dataToFilter)
				return dataToFilter
			}
			const result = dataToFilter.filter(s => s.Tags && s.Tags.toLowerCase().includes(props.query.toLowerCase()))
			//console.log("Filtered Titles (with query):", result)
			return result
		})

    const totalPages = computed(() => {
      return Math.ceil(filteredTitles.value.length / perPage);
    })
    const paginatedTitles = computed(() => {
      const start = (currentPage.value - 1) * perPage
      const end = start + perPage
      return filteredTitles.value.slice(start, end)
    })
    const paginatedAction = (pageNum) => {
      currentPage.value = pageNum
    }
		return {
			filteredTitles,
      currentPage, perPage, totalPages, paginatedAction, paginatedTitles
		}
	}
}
</script>

<style scoped>

	.root {
		width: 800px;
		margin: 0 auto;
	}

	.root p {
		text-align: right;
		font-size: 0.7em;
		margin: 0;
	}

	ul {
		list-style:  none;
		width: 50px 0;
		padding: 0;
		background-color: #fafafa;
		border-radius: 5px;
		border: 1px solid #ddd;
	}

	li {
		text-align: left;
		padding: 20px;
		border-bottom: 1px solid #ddd;
	}

	li:nth-last-of-type(1) {
		border-bottom: none;
	}
.pagination {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin-top: 20px;
  background: none !important;
  border: none !important;
}
.page-item {
  margin: 0 5px;
}
:deep(.page-item a) {
  text-decoration: none;
  color: #42b983;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: block;
}
:deep(.page-item:not(.active) a:hover) {
  text-decoration: underline !important;
  color: #2c3e50;
  background-color: #f0fdf4;
}
:deep(.page-item.active a) {
  color: white !important;
  background-color: #999 !important;
  border-color: #999 !important;
  cursor: default;
}
:deep(.page-item.disabled a) {
  color: #ccc !important;
  cursor: not-allowed;
}
.page-item.disabled a {
  color: #ccc;
  cursor: not-allowed;
}
</style>
