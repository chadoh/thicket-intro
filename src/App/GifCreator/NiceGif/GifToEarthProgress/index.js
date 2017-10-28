import React from 'react'
import mars from '../../WifiOffExplanation/mars.svg'
import earth from '../../../Hero/earth.svg'
import './GifToEarthProgress.css'

const MILLISECONDS_TO_MARS = 3 * 60 * 1000

const getProgress = start => {
  const now = new Date()
  return Math.min((now - start) / MILLISECONDS_TO_MARS, 1)
}

let lastKnownScrollPosition = 0
let ticking = false

const Sending = ({ gif }) => (
  <div>
    <img src={mars} alt="mars" className="mars" />
    <div className="GifToEarthProgress--progressBars">
      <div className="gif terran">
        ?
      </div>
      <div className="progress fromEarth"><div /></div>
      <div className="progress fromMars"><div /></div>
      <div className="gif martian">
        <img src={gif} alt="your GIF" />
      </div>
    </div>
    <img src={earth} alt="earth" className="earth"  />
  </div>
)

const Arrived = ({ scrollTo }) => (
  <div className="arrived">
    <span>
      Interplanetary GIFs unlocked! <a href={scrollTo}>Check it out!</a> 🎉🎉
    </span>
  </div>
)

export default class GifToEarthProgress extends React.Component {

  componentDidMount() {
    var progress = getProgress(this.props.gifCreated);
    document.documentElement.style.setProperty(
      '--progress',
      progress * 100 + '%'
    )
    document.documentElement.style.setProperty(
      '--timeToComplete',
      (1 - progress) * 180 + 's'
    )

    this.adjustOffset()

    setTimeout(this.setArrived, (1 - progress) * 180 * 1000)

    window.addEventListener('scroll', this.optimize(this.maybeStick))
    window.addEventListener('resize', this.optimize(this.adjustOffset))
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.optimize(this.maybeStick))
    window.removeEventListener('resize', this.optimize(this.adjustOffset))
  }

  optimize = func => () => {
    lastKnownScrollPosition = window.scrollY
    if (!ticking) {
      window.requestAnimationFrame(() => {
        func(lastKnownScrollPosition)
        ticking = false
      })
    }
    ticking = true
  }

  maybeStick = scrollPosition => {
    if (scrollPosition > this.offset) {
      this.wrap.className = "GifToEarthProgress sticky"
    } else {
      this.wrap.className = "GifToEarthProgress"
    }
  }

  adjustOffset = () => {
    this.offset = this.wrap.parentElement.offsetTop
  }

  setArrived = () => {
    this.props.setArrived()
    setTimeout(
      this.adjustOffset,
      500 // wait for image to load; TODO: come up with a better way to do this
    )
  }

  render() {
    const { id, gif, arrived } = this.props

    return (
      <div ref={div => this.wrap = div} className="GifToEarthProgress">
        {arrived ? <Arrived scrollTo={`#${id}`} /> : <Sending gif={gif} />}
      </div>
    )
  }
}
