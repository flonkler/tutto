import "./Layout.css"

import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react"
import { Icon, type IconType } from "./Icons"
import { useResizeObserver } from "../lib/hooks"
import { BlankPage } from "../pages/BlankPage"

export type LayoutPage = {
  icon: IconType,
  label: string,
  group: number,
  content?: ReactNode,
}
type LayoutGroup = {
  width: number
  offset: number
  index: number
  pages: LayoutPage[]
  activePage: string
}

const PAGE_MIN_WIDTH = 350

interface LayoutProps {
  pages: LayoutPage[]
}
export function Layout({ pages }: LayoutProps) {
  const [containerRect, containerElement, containerRefCallback] = useResizeObserver<HTMLElement>()
  const [groups, setGroups] = useState<LayoutGroup[]>([])
  const [dividers, setDivider] = useState<number[]>([])
  const [movingDivider, setMovingDivider] = useState<number>(-1)

  function onTabClick(label: string, groupIndex: number) {
    setGroups(prev => prev.map((group, index) => index === groupIndex ? {...group, activePage: label} : group))
  }

  function onMouseMove(ev: MouseEvent) {
    if (movingDivider !== -1) {
      ev.preventDefault()
      const minValue = movingDivider > 0 ? dividers[movingDivider] : 0
      const maxValue = movingDivider < dividers.length - 1 ? dividers[movingDivider] : containerRect.width
      const parentOffset = containerElement?.offsetLeft ?? 0
      const nextOffset = Math.min(maxValue - PAGE_MIN_WIDTH, Math.max(minValue + PAGE_MIN_WIDTH, ev.clientX - parentOffset))
      setDivider(prev => prev.map((value, index) => index === movingDivider ? nextOffset : value))  
    }    
  }

  // Update layout
  useEffect(() => {
    const currentWidth = containerRect?.width ?? 0
    const useSingleGroup = currentWidth < 2 * PAGE_MIN_WIDTH

    const nextGroups: LayoutGroup[] = []
    pages.forEach(page => {
      let group = nextGroups.find(g => useSingleGroup || g.index === page.group)
      if (!group) {
        group = {width: currentWidth, offset: 0, index: page.group, pages: [], activePage: ""}
        nextGroups.push(group)
      }
      group.pages.push(page)
    })

    const numDividers = nextGroups.length - 1
    if (dividers.length < numDividers) {
      setDivider(Array(numDividers).fill(null).map((_, i) => currentWidth * (i + 1) / nextGroups.length))
      return
    }

    // Use existing active pages if the number of groups don't change. Otherwise, reset to the default
    let previousOffset = 0
    nextGroups.forEach((g, i) => {
      if (nextGroups.length > 1) {
        const nextOffset = i >= dividers.length ? currentWidth : dividers[i]
        g.offset = previousOffset
        g.width = nextOffset - previousOffset
        previousOffset = nextOffset
      }
      g.activePage = (groups.length !== nextGroups.length) ? g.pages[0].label : groups[i].activePage
    })
    setGroups(nextGroups)
  }, [dividers, pages, containerRect])

  const content = useMemo<ReactNode[]>(() => {
    const elements: ReactNode[] = []
    groups.forEach((group, index) => {
      elements.push(
        <div className="layout-page" key={`page-${index}`} style={{width: group.width, left: group.offset}}>
          {pages.find(page => page.label === group.activePage)?.content ?? <BlankPage />}
        </div>
      )
      if (index < dividers.length) elements.push(
        <div
          key={`divider-${index}`}
          className="layout-divider"
          style={{left: dividers[index]}}
          onMouseDown={() => setMovingDivider(index)}>
        </div>
      )
    })
    return elements
  }, [groups, dividers])

  return (
    <div className={"layout" + (movingDivider !== -1 ? " layout--moving" : "")}
      onMouseUp={() => setMovingDivider(-1)} onMouseLeave={() => setMovingDivider(-1)}>
      <header className="layout-nav">
        <div className="container">
          <div className="layout-nav__wrapper" ref={containerRefCallback}>
            {groups.map((group, index) => (
              <div key={index} className="layout-nav-group" style={{left: group.offset, width: group.width}}>
                {group.pages.map(page => (
                  <button key={page.label} onClick={() => onTabClick(page.label, index)}
                    className={"layout-nav-tab" + (group.activePage === page.label ? " layout-nav-tab--selected" : "") }>
                    <Icon icon={page.icon} />
                    {page.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </header>
      <main className="layout-content">
        <div className="container">
          <div className="layout-content__wrapper" onMouseMove={onMouseMove}>
            {...content}
          </div>
        </div>
      </main>
    </div>
  )
}