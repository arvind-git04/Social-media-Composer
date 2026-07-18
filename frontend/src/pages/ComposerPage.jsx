import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import CreatePost from '../components/CreatePost.jsx'
import PostList from '../components/PostList.jsx'
import ScheduleCalendar from '../components/ScheduleCalendar.jsx'
import { selectAllPosts } from '../store/postsSlice.js'

export default function ComposerPage() {
  const posts = useSelector(selectAllPosts)
  const scheduledPosts = useMemo(() => posts.filter((post) => post.schedule), [posts])

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero">
        <div className="dashboard-intro">
          <p className="eyebrow">Social Media Studio</p>
          <h1>Create, manage, and schedule your posts in one place.</h1>
          <p className="intro">
            Publish to Facebook, Instagram, X, Reddit, Quora, or Pinterest while keeping your content calendar organized and your workflow effortless.
          </p>
        </div>
        <div className="dashboard-stats">
          <div className="stat-card">
            <strong>{posts.length}</strong>
            <span>Total posts</span>
          </div>
          <div className="stat-card">
            <strong>{scheduledPosts.length}</strong>
            <span>Scheduled</span>
          </div>
        </div>
      </section>

      <section className="dashboard-main">
        <aside className="dashboard-sidebar">
          <div className="overview-card">
            <h3>Today’s workflow</h3>
            <ul className="workflow-list">
              <li>Draft your next message</li>
              <li>Review platform requirements</li>
              <li>Schedule it for later</li>
            </ul>
          </div>
          <div className="overview-card accent-card">
            <h3>Focus areas</h3>
            <div className="workflow-pills">
              <span className="workflow-pill">Content</span>
              <span className="workflow-pill">Timing</span>
              <span className="workflow-pill">Platforms</span>
            </div>
          </div>
        </aside>

        <div className="dashboard-content">
          <div className="panel-card panel-wide">
            <div className="panel-header">
              <h2>Create new post</h2>
              <span className="badge">Title • Media • Platforms • Schedule</span>
            </div>
            <CreatePost />
          </div>

          <div className="dashboard-grid">
            <div className="panel-card">
              <div className="panel-header">
                <h2>Recent posts</h2>
                <span className="badge info">Edit & delete</span>
              </div>
              <PostList />
            </div>

            <div className="panel-card">
              <div className="panel-header">
                <h2>Scheduled overview</h2>
                <span className="badge">Timeline</span>
              </div>
              <ScheduleCalendar />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
