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
        pages.push(page)
    })
    return pages
}

const generateDist = () => {
    const pagesPath = getPagesPath("src/pages")
    for (let i = 0; i < pagesPath.length; i++) {
        const pagePath = pagesPath[i];
        const fileName = "dist/" + pagePath.replace(".js", ".html")
        fs.writeFileSync(fileName, fs.readFileSync(`src/pages/${pagePath}`, "utf8"), (err) => {
            if (err) {
                console.log("error when building your app: " + err)
                return
            }
        })
    }
}
generateDist()