export function groupPostsByMode(posts = []) {
  return posts.reduce(
    (groups, post) => {
      if (!post) {
        return groups
      }

      if (post.schedule) {
        groups.scheduled.push(post)
      } else {
        groups.postNow.push(post)
      }

      return groups
    },
    { postNow: [], scheduled: [] },
  )
}
