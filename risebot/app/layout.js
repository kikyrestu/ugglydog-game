import { Space_Grotesk } from 'next/font/google'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import 'aos/dist/aos.css';
import "/public/style/swiper/swiper-bundle.min.css"
import "/public/assets/font/font-awesome.css"
import "/public/assets/font/risebot.css"
import "/public/assets/font/font-awesome.css"
// import "/public/style/bootstrap/css/bootstrap.css"
import "/public/style/dist/app.css"
import Head from 'next/head'
export const metadata = {
    title: 'Risebot - Metaverse Web3 IGO Launchpad Next.js Template',
    description: 'Generated by create next app',
}
const grotesk = Space_Grotesk({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: "--grotesk",
    display: 'swap',
})

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${grotesk.variable} header-fixed page-loaded`}>{children}</body>
        </html>
    )
}
