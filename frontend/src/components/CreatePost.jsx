import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addPost } from '../store/postsSlice.js'
import {
  selectSelectedPlatformIds,
  togglePlatform,
} from '../store/platformsSlice.js'
import { selectAuthToken } from '../store/authSlice.js'
import { normalizeSelectedPlatforms, platforms, validateMediaFile } from '../utils/platforms.js'

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M22 5.8c-.8.4-1.6.6-2.5.7a4.4 4.4 0 0 0 1.9-2.4 8.7 8.7 0 0 1-2.7 1 4.3 4.3 0 0 0-7.5 3.9A12.2 12.2 0 0 1 3 4.7a4.3 4.3 0 0 0 1.3 5.8 4.2 4.2 0 0 1-2-.6v.1a4.3 4.3 0 0 0 3.4 4.2 4.4 4.4 0 0 1-2 .1 4.3 4.3 0 0 0 4 3 8.7 8.7 0 0 1-5.4 1.9A8.8 8.8 0 0 1 2 18.1a12.3 12.3 0 0 0 6.6 1.9c7.9 0 12.2-6.5 12.2-12.2 0-.2 0-.4 0-.6A8.8 8.8 0 0 0 22 5.8Z" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.9-7.9a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2ZM18 5.6c-.1-1.1-.6-2-1.4-2.8A3.9 3.9 0 0 0 13.8 1.4C12.9 1.2 11.6 1.2 9.9 1.2H9.8C8 1.2 6.7 1.2 5.8 1.4a3.9 3.9 0 0 0-2.8 1.4C2 3.6 1.6 4.5 1.5 5.6A33 33 0 0 0 1.4 9.8v.4c0 1.8 0 3.1.2 4.1.1 1.1.6 2 1.4 2.8a3.9 3.9 0 0 0 2.8 1.4c.9.2 2.2.2 4 .2h.1c1.8 0 3.1 0 4-.2a3.9 3.9 0 0 0 2.8-1.4c.8-.8 1.3-1.7 1.4-2.8.2-1 .2-2.3.2-4.1v-.4c0-1.8 0-3.1-.2-4.1ZM20 14.2c0 1 .1 1.6-.1 2-.2.7-.7 1.2-1.4 1.4-.5.2-1 .2-2 .2h-.1c-1 0-1.6.1-2 .1-1.1 0-1.8-.1-2.4-.4a3 3 0 0 1-1.4-1.4c-.2-.5-.4-1.3-.4-2.4 0-.4-.1-1-.1-2v-.1c0-1 .1-1.6.1-2 .2-.7.7-1.2 1.4-1.4.5-.2 1-.2 2-.2h.1c1 0 1.6-.1 2-.1 1.1 0 1.8.1 2.4.4.6.2 1.2.7 1.4 1.4.2.5.2 1.1.2 2v.1Z" />
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M13.5 22V13.2h3.2l.5-3.1h-3.7V7.1c0-.9.2-1.5 1.6-1.5h1.7V2.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4v2.5H8.4v3.1h2.1V22h3Z" />
  </svg>
)

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M20.5 3H3.5A1.5 1.5 0 0 0 2 4.5v15A1.5 1.5 0 0 0 3.5 21h17a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 20.5 3Zm-13 15H4V9h3.5v9Zm-1.7-10.2a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm12.2 10.2h-3.5v-4.4c0-1-.4-1.7-1.4-1.7-.8 0-1.3.6-1.6 1.2-.1.2-.1.5-.1.8v4.1h-3.5s.1-6.6 0-7.3h3.5v1c.5-.8 1.3-1.9 3.2-1.9 2.3 0 4 1.5 4 4.8v3.4Z" />
  </svg>
)

const RedditIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M12 2.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Zm0 5.1a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6ZM18 10.5a6 6 0 0 0-11.9 0 6 6 0 0 0 1.4 3.9c-.4.5-.7 1.1-.7 1.8 0 1.8 1.8 3.3 4.4 3.8-.1.2-.2.5-.2.7a.9.9 0 0 0 .9.9h.4c.5 0 .9-.4.9-.9 0-.2-.1-.5-.2-.7 2.6-.5 4.4-2 4.4-3.8 0-.7-.3-1.3-.7-1.8A6.1 6.1 0 0 0 18 10.5Zm-7.3 4.6c-.3 0-.6-.2-.8-.4-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0 .6.6 1.6.6 2.1 0 .2-.2.5-.2.7 0 .2.2.2.5 0 .7-.2.2-.5.4-.8.4-.4 0-.8-.1-1.1-.3-.2.2-.5.3-.8.3Zm4.6-1.9c0 1.2-1.6 2.1-3.6 2.1S7.4 16.5 7.4 15.3c0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 .8 1.3 1.3 2.8 1.3 1.5 0 2.8-.5 2.8-1.3 0-.4.3-.7.7-.7.4 0 .7.3.7.7Zm1.5-1.2c-.9 0-1.6-.7-1.6-1.6s.7-1.6 1.6-1.6 1.6.7 1.6 1.6-.7 1.6-1.6 1.6Z" />
  </svg>
)

const QuoraIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M12 2C8 2 5 5.1 5 9.1c0 3.9 2.6 7.2 6.1 7.9V22h1.8v-5.1c3.5-.7 6.1-4 6.1-7.9C19 5.1 16 2 12 2Zm0 13.7c-3.2 0-5.8-2.5-5.8-5.6S8.8 4.5 12 4.5s5.8 2.5 5.8 5.6-2.6 5.6-5.8 5.6Z" />
  </svg>
)

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.5 2 2 6.5 2 12c0 3.8 2.3 7 5.6 8.4-.1-.8-.1-1.8.1-2.5.1-.5.8-3.3.8-3.3s-.2-.4-.2-1.1c0-1 .6-1.8 1.4-1.8.7 0 1 .5 1 1.1 0 .7-.4 1.8-.6 2.8-.2.8.4 1.5 1.2 1.5 1.5 0 2.6-1.6 2.6-3.8 0-2-1.4-3.4-3.5-3.4-2.4 0-3.8 1.8-3.8 3.7 0 .7.3 1.5.8 1.9.1.1.2.1.2.1-.1.3-.2.8-.2.9 0 .2-.1.2-.3.1-1.3-.5-2.2-2-2.2-3.5 0-2.6 1.9-5 5.5-5 2.9 0 4.9 2.1 4.9 4.9 0 2.9-1.8 5.2-4.2 5.2-1.1 0-2.1-.6-2.4-1.4 0 0-.5 2-.6 2.5-.2.8-.7 1.6-1.1 2.2 1 .3 2 .4 3.1.4 5.5 0 10-4.5 10-10S17.5 2 12 2Z" />
  </svg>
)

const platformOptions = [
  { id: 'x', name: 'Twitter', icon: <TwitterIcon /> },
  { id: 'ig', name: 'Instagram', icon: <InstagramIcon /> },
  { id: 'fb', name: 'Facebook', icon: <FacebookIcon /> },
  { id: 'linkedin', name: 'LinkedIn', icon: <LinkedinIcon /> },
  { id: 'reddit', name: 'Reddit', icon: <RedditIcon /> },
  { id: 'quora', name: 'Quora', icon: <QuoraIcon /> },
  { id: 'pinterest', name: 'Pinterest', icon: <PinterestIcon /> },
]

function PlatformConstraints({ selectedPlatformIds }) {
  const selectedItems = useMemo(() => {
    const ids = selectedPlatformIds.length ? selectedPlatformIds : Object.keys(platforms)
    return ids.map((id) => ({ id, ...platforms[id] })).filter(Boolean)
  }, [selectedPlatformIds])

  return (
    <div className="platform-constraints">
      <p className="platform-constraints-title">Platform constraints</p>
      <div className="constraint-list">
        {selectedItems.map((platform) => (
          <div key={platform.id} className="constraint-card">
            <div className="constraint-card-header">
              <strong>{platform.name}</strong>
              <span className="constraint-tag">#{platform.maxHashtags} hashtags</span>
            </div>
            <p>{platform.hint}</p>
            <ul>
              <li>Max characters: {platform.maxChars}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CreatePost() {
  const dispatch = useDispatch()
  const token = useSelector(selectAuthToken)
  const selectedPlatformIds = useSelector(selectSelectedPlatformIds)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [postMode, setPostMode] = useState('now')
  const [schedule, setSchedule] = useState('')
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false)
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState('')
  const platformDropdownRef = useRef(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl('')
      setVideoThumbnailUrl('')
      return undefined
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    if (file.type.startsWith('video/')) {
      const video = document.createElement('video')
      video.src = url
      video.muted = true
      video.playsInline = true
      video.currentTime = 0.1
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 320
        canvas.height = 180
        const context = canvas.getContext('2d')
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height)
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
          setVideoThumbnailUrl(thumbnail)
        }
      }
    }

    return () => {
      URL.revokeObjectURL(url)
      setVideoThumbnailUrl('')
    }
  }, [file])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (platformDropdownOpen && platformDropdownRef.current && !platformDropdownRef.current.contains(event.target)) {
        setPlatformDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [platformDropdownOpen])

  const selectedPlatformLabel = selectedPlatformIds.length
    ? platformOptions
        .filter((platform) => selectedPlatformIds.includes(platform.id))
        .map((platform) => platform.name)
        .join(', ')
    : 'Select platforms'

  function handleFile(event) {
    const selectedFile = event.target.files[0]
    if (!selectedFile) {
      setFile(null)
      setFileError('')
      return
    }

    const validationError = validateMediaFile(selectedFile)
    if (validationError) {
      setFile(null)
      setFileError(validationError)
      return
    }

    setFile(selectedFile)
    setFileError('')
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragOver(false)
    const selectedFile = event.dataTransfer.files[0]
    if (!selectedFile) {
      return
    }

    const validationError = validateMediaFile(selectedFile)
    if (validationError) {
      setFile(null)
      setFileError(validationError)
      return
    }

    setFile(selectedFile)
    setFileError('')
  }

  const handlePlatformToggle = (event) => {
    const platformId = event.target.value
    dispatch(togglePlatform(platformId))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!token) {
      return alert('Please sign in before creating a post.')
    }

    if (!selectedPlatformIds.length) {
      return alert('Select at least one platform before publishing.')
    }

    const normalizedPlatforms = normalizeSelectedPlatforms(selectedPlatformIds)
    if (!normalizedPlatforms.length) {
      return alert('Select at least one platform before publishing.')
    }

    const mediaError = validateMediaFile(file)
    if (mediaError) {
      setFileError(mediaError)
      return
    }

    if (postMode === 'schedule' && !schedule) {
      return alert('Please select a date and time to schedule this post.')
    }

    const payload = {
      title,
      description,
      platforms: normalizedPlatforms,
      schedule: postMode === 'schedule' && schedule ? new Date(schedule).toISOString() : null,
      media: file
        ? [{ url: previewUrl, type: file.type, size: file.size }]
        : [],
    }

    dispatch(addPost({ post: payload, token }))
    setTitle('')
    setDescription('')
    setSchedule('')
    setFile(null)
    setFileError('')
  }

  return (
    <form onSubmit={handleSubmit} className="create-post">
      <label htmlFor="post-title">Title*</label>
      <input id="post-title" value={title} onChange={(event) => setTitle(event.target.value)} required />

      <fieldset className="platform-picker" ref={platformDropdownRef}>
        <legend className="platform-row-label">Publish to</legend>
        <button
          type="button"
          className={`platform-dropdown-button ${platformDropdownOpen ? 'open' : ''}`}
          onClick={() => setPlatformDropdownOpen((open) => !open)}
          aria-expanded={platformDropdownOpen}
        >
          <span className="platform-dropdown-value">{selectedPlatformLabel}</span>
          <span className="platform-dropdown-icon">▾</span>
        </button>
        {platformDropdownOpen && (
          <div className="platform-dropdown-menu">
            {platformOptions.map((platform) => {
              const active = selectedPlatformIds.includes(platform.id)
              return (
                <label key={platform.id} className={`platform-dropdown-option ${active ? 'active' : ''}`}>
                  <span className="platform-checkbox-wrapper">
                    <input
                      type="checkbox"
                      value={platform.id}
                      checked={active}
                      onChange={handlePlatformToggle}
                    />
                    <span className="platform-checkbox-indicator">✓</span>
                  </span>
                  <span className="platform-dropdown-icon-wrap">{platform.icon}</span>
                  <span className="platform-dropdown-label">{platform.name}</span>
                </label>
              )
            })}
          </div>
        )}
      </fieldset>

      <PlatformConstraints selectedPlatformIds={selectedPlatformIds} />

      <label htmlFor="post-media" className={`upload-dropzone ${isDragOver ? 'drag-over' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <input id="post-media" type="file" accept="image/*,video/*" onChange={handleFile} className="file-input" />
        <div className="upload-dropzone-content">
          {file ? (
            <>
              <p className="upload-status">Done!</p>
              <p className="upload-subtitle">Upload more?</p>
            </>
          ) : (
            <>
              <p className="upload-title">Drag & drop a file here</p>
              <p className="upload-help">or click to browse</p>
            </>
          )}
        </div>
      </label>
      <p className="field-help">Upload an image or video to attach to the post.</p>
      {fileError ? <p className="file-error">{fileError}</p> : null}
      {file ? (
        <div className="media-preview">
          {file.type.startsWith('image/') ? (
            <img src={previewUrl} alt="Selected media preview" />
          ) : (
            <>
              <div className="video-preview-card">
                {videoThumbnailUrl ? (
                  <img src={videoThumbnailUrl} alt="Video thumbnail preview" className="video-thumbnail" />
                ) : (
                  <div className="video-placeholder">Generating thumbnail…</div>
                )}
                <video controls src={previewUrl} className="video-player" />
              </div>
            </>
          )}
          <div className="file-info">
            <strong>{file.name}</strong>
            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>
      ) : null}

      <label htmlFor="post-description">Description</label>
      <textarea id="post-description" value={description} onChange={(event) => setDescription(event.target.value)} />

      <div className="post-mode-controls">
        <label className={`post-mode-option ${postMode === 'now' ? 'active' : ''}`}>
          <input
            type="radio"
            name="postMode"
            value="now"
            checked={postMode === 'now'}
            onChange={(event) => {
              setPostMode(event.target.value)
              setSchedule('')
            }}
          />
          <span>Post now</span>
        </label>
        <label className={`post-mode-option ${postMode === 'schedule' ? 'active' : ''}`}>
          <input
            type="radio"
            name="postMode"
            value="schedule"
            checked={postMode === 'schedule'}
            onChange={(event) => setPostMode(event.target.value)}
          />
          <span>Schedule</span>
        </label>
      </div>

      {postMode === 'schedule' && (
        <>
          <label htmlFor="post-schedule">Schedule</label>
          <input
            id="post-schedule"
            type="datetime-local"
            value={schedule}
            onChange={(event) => setSchedule(event.target.value)}
          />
        </>
      )}

      <button type="submit">Create Post</button>
    </form>
  )
}
