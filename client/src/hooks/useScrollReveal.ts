import { useEffect, useRef } from 'react'

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options: ScrollRevealOptions = {}) {
  const elementRef = useRef<T>(null)
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = true
  } = options

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            
            // Add a slight delay before triggering staggered children
            setTimeout(() => {
              const children = entry.target.querySelectorAll('.scroll-delay-100, .scroll-delay-200, .scroll-delay-300, .scroll-delay-400, .scroll-delay-500, .scroll-delay-600, .scroll-reveal, .scroll-scale-up, .scroll-bounce-in, .scroll-slide-left, .scroll-slide-right')
              children.forEach((child) => {
                child.classList.add('revealed')
              })
            }, 100)

            if (triggerOnce) {
              observer.unobserve(entry.target)
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove('revealed')
            
            // Remove from children too
            const children = entry.target.querySelectorAll('.revealed')
            children.forEach((child) => {
              child.classList.remove('revealed')
            })
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce])

  return elementRef
}

// Utility function to add scroll animations to multiple elements
export function useScrollRevealMultiple<T extends HTMLElement = HTMLDivElement>(
  count: number, 
  options: ScrollRevealOptions = {}
) {
  const refs = useRef<(T | null)[]>([])
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = true
  } = options

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            
            // Add revealed class to children with scroll animation classes
            setTimeout(() => {
              const children = entry.target.querySelectorAll('.scroll-delay-100, .scroll-delay-200, .scroll-delay-300, .scroll-delay-400, .scroll-delay-500, .scroll-delay-600, .scroll-reveal, .scroll-scale-up, .scroll-bounce-in, .scroll-slide-left, .scroll-slide-right')
              children.forEach((child) => {
                child.classList.add('revealed')
              })
            }, 100)
            
            if (triggerOnce) {
              observer.unobserve(entry.target)
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove('revealed')
            
            // Remove from children too
            const children = entry.target.querySelectorAll('.revealed')
            children.forEach((child) => {
              child.classList.remove('revealed')
            })
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    refs.current.forEach((element) => {
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce])

  const setRef = (index: number) => (element: T | null) => {
    refs.current[index] = element
  }

  return setRef
}