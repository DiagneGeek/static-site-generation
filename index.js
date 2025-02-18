import express from "express"
import fs from "fs"
import path from "path"

const app = express()
const distDir = "dist"
const pagesDir = "pages"

const useDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
}
useDir(distDir)


const getPagesPath = (dir) => {
    let pages = []
    fs.readdirSync(dir).forEach(page => {
        const pagePath = path.join(dir, page)
        if (fs.statSync(pagePath).isDirectory()) {
            useDir(path.join(distDir, pagePath.replace("src/pages", "")))
            pages = pages.concat(getPagesPath(pagePath))
        } else {
            pages.push(pagePath.replace("src/pages/", ""))
        }
    })
    return pages
}

const buildContent = (base, fileName) => {
    const start = base.indexOf(`const ${fileName} =`)
    let content = base.slice(
        start,
        base.indexOf('</template>', start) + 11
    )
    content = content.slice(
        content.indexOf("=> {") + 4,
    ).trim()
    
    const metaStart = base.indexOf("mataData = (({") + 12
    let metaData = base.slice(
        metaStart,
        base.indexOf("}))")
    ).replace("))", "")
    console.log(metaData, metaStart)
     const script = content.slice(0, content.indexOf("return <template>")).trim()
     const template = content.slice(content.indexOf("return <template>") + 17, -17).trim()
     
    return metaData
}


const generateDist = () => {
    const pagesPath = getPagesPath("src/pages")
    for (let i = 0; i < pagesPath.length; i++) {
        const pagePath = pagesPath[i];
        const filePath = path.join("dist",pagePath.replace(".js", ".html"))
        const fileName = filePath.slice(filePath.lastIndexOf("/")+1, filePath.indexOf(".html"))
        const content = buildContent(fs.readFileSync(`src/pages/${pagePath}`, "utf8"), fileName)
        fs.writeFileSync(filePath, content, (err) => {
            if (err) {
                console.log("error when building your app: " + err)
                return
            }
        })
    }
}
generateDist()