declare module 'gray-matter' {
  interface GrayMatterResult<D = Record<string, unknown>> {
    data: D
    content: string
    excerpt?: string
  }
  function matter(input: string, options?: Record<string, unknown>): GrayMatterResult
  export default matter
}
