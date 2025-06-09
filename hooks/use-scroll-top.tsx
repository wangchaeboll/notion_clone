import React from 'react'

const UseScrollTop = ( threshold = 10) => {
    const [scrolled, setScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = ()=> {
            if(window.scrollY > threshold){
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [  threshold])
    return scrolled
}
export default UseScrollTop
