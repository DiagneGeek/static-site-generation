import express from "express"
import fs from "fs"
import path from "path"

const app = express()
const distDir = "dist"
const pagesDir = "pages"


if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir)
}


const getPagesPath = (dir) => {
    let pages = []
    fs.readdirSync(dir).forEach(page => {
        const pagePath = path.join(dir, page)
        if (fs.statSync(pagePath).isDirectory()) {
            fs.mkdirSync(path.join(distDir, pagePath.replace("src/pages", "")))
            pages = pages.concat(getPagesPath(pagePath))
        } else {
            pages.push(pagePath.replace("src/pages/", ""))
        }
    })
    return pages
}

const generateDist = () => {
    const pagesPath = getPagesPath("src/pages")
    for (let i = 0; i < pagesPath.length; i++) {
        const pagePath = pagesPath[i];
        const fileName = path.join("dist",pagePath.replace(".js", ".html"))
        console.log(`src/pages/${pagePath}`, fileName)
        fs.writeFileSync(fileName, fs.readFileSync(`src/pages/${pagePath}`, "utf8"), (err) => {
            if (err) {
                console.log("error when building your app: " + err)
                return
            }
        })
    }
}
generateDist()