import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectScheduledPosts } from '../selectors/postsSelectors.js'
import { fetchPosts } from '../store/postsSlice.js'
import { selectAuthToken } from '../store/authSlice.js'

export default function ScheduleCalendar() {
  const dispatch = useDispatch()
  const scheduledPosts = useSelector(selectScheduledPosts)
  const status = useSelector((state) => state.posts.status)
  const token = useSelector(selectAuthToken)

  useEffect(() => {
    if (status === 'idle' && token) {
      dispatch(fetchPosts(token))
    }
  }, [dispatch, status, token])

  const groupedByDate = useMemo(() => {
    return scheduledPosts.reduce((acc, post) => {
      const date = new Date(post.schedule).toLocaleDateString()
      acc[date] = acc[date] || []
      acc[date].push(post)
      return acc
    }, {})
  }, [scheduledPosts])

  return (
    <section className="schedule-calendar">
      <h2>Post Schedule</h2>
      {status === 'loading' && <p>Loading schedule…</p>}
      {status !== 'loading' && Object.keys(groupedByDate).length === 0 ? (
        <p>No scheduled posts yet.</p>
      ) : (
        Object.entries(groupedByDate).map(([date, posts]) => (
          <div key={date} className="calendar-day">
            <h3>{date}</h3>
            <ul>
              {posts.map((post) => (
                <li key={post._id}>
                  <strong>{post.title}</strong>
                  <span>{new Date(post.schedule).toLocaleTimeString()}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  )
}
