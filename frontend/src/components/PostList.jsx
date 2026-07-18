import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts, deletePost, updatePost } from '../store/postsSlice.js'
import { selectAllPosts } from '../store/postsSlice.js'
import { selectAuthToken } from '../store/authSlice.js'
import { selectAvailablePlatforms } from '../store/platformsSlice.js'
import { normalizeSelectedPlatforms } from '../utils/platforms.js'
import { groupPostsByMode } from '../utils/postGroups.js'

const emptyForm = {
  title: '',
  description: '',
  schedule: '',
  platforms: [],
}

export default function PostList({ onEdit }) {
  const dispatch = useDispatch()
  const posts = useSelector(selectAllPosts)
  const status = useSelector((state) => state.posts.status)
  const token = useSelector(selectAuthToken)
  const availablePlatforms = useSelector(selectAvailablePlatforms)
  const [editingPostId, setEditingPostId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (status === 'idle' && token) {
      dispatch(fetchPosts(token))
    }
  }, [dispatch, status, token])

  const startEdit = (post) => {
    onEdit?.(post)
    setEditingPostId(post._id)
    setForm({
      title: post.title || '',
      description: post.description || '',
      schedule: post.schedule ? new Date(post.schedule).toISOString().slice(0, 16) : '',
      platforms: normalizeSelectedPlatforms(Array.isArray(post.platforms) ? post.platforms : []),
    })
  }

  const cancelEdit = () => {
    setEditingPostId(null)
    setForm(emptyForm)
  }

  const handlePlatformChange = (event) => {
    const values = normalizeSelectedPlatforms(Array.from(event.target.selectedOptions, (option) => option.value))
    setForm((current) => ({ ...current, platforms: values }))
  }

  const saveEdit = async (event) => {
    event.preventDefault()
    const currentPost = posts.find((post) => post._id === editingPostId)
    if (!currentPost) return

    const payload = {
      ...currentPost,
      title: form.title,
      description: form.description,
      platforms: form.platforms,
      schedule: form.schedule ? new Date(form.schedule).toISOString() : null,
    }

    await dispatch(updatePost({ post: payload, token }))
    cancelEdit()
  }

  const groupedPosts = groupPostsByMode(posts)

  return (
    <div className="post-list">
      {status === 'loading' && <p>Loading posts…</p>}
      {['postNow', 'scheduled'].map((groupKey) => {
        const sectionTitle = groupKey === 'postNow' ? 'Post now' : 'Scheduled'
        const sectionPosts = groupedPosts[groupKey]

        if (!sectionPosts.length) {
          return null
        }

        return (
          <section key={groupKey} className="post-group">
            <h3>{sectionTitle}</h3>
            {sectionPosts.map((post) => {
              const isEditing = editingPostId === post._id

              return (
                <div key={post._id} className="post-item">
                  {isEditing ? (
                    <form className="edit-post-form" onSubmit={saveEdit}>
                      <input
                        value={form.title}
                        onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                        placeholder="Title"
                        required
                      />
                      <textarea
                        value={form.description}
                        onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                        placeholder="Description"
                      />
                      <select multiple value={form.platforms} onChange={handlePlatformChange} className="platform-select">
                        {availablePlatforms.map((platform) => (
                          <option key={platform.id} value={platform.id}>
                            {platform.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="datetime-local"
                        value={form.schedule}
                        onChange={(event) => setForm((current) => ({ ...current, schedule: event.target.value }))}
                      />
                      <div className="post-actions">
                        <button type="submit">Save</button>
                        <button type="button" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h4>{post.title}</h4>
                      <p>{post.description}</p>
                      <small>{post.schedule ? new Date(post.schedule).toLocaleString() : 'Published immediately'}</small>
                      <p className="platform-summary">Platforms: {Array.isArray(post.platforms) && post.platforms.length ? post.platforms.join(', ') : 'None'}</p>
                      <div className="post-actions">
                        <button type="button" onClick={() => startEdit(post)}>
                          Edit
                        </button>
                        <button type="button" onClick={() => dispatch(deletePost({ postId: post._id, token }))}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}
