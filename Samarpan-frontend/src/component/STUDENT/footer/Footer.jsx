import React from 'react'

const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 h-12 bg-white border-t flex items-center justify-center text-sm text-gray-500 z-40">
            &copy; {new Date().getFullYear()} Project Samarpan. All rights reserved.
        </footer>
    )
}

export default Footer;
