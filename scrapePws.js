//Import puppeteer and file system(fs)
const fs = require('fs')
const puppeteer = require('puppeteer')

const passwords = []

//Launch browser and open Password page of all password data 
async function getPng() {
	const browser = await puppeteer.launch({headless : false}) //won't open new page
	const page = await browser.newPage()
	// navigate to url and wait until page loads completely
	await page.goto('https://www.passwordrandom.com/most-popular-passwords',{waitUntil : 'networkidle0'}); 
	//get the text password of the element.
    let password = await page.evaluate(() => Array.from(document.querySelectorAll('tbody tr td:nth-child(2)'), element => element.textContent))

	passwords.push(password);
	//Create a for loop to go to different page 
	for (let i = 0; i < 100; i++) {
		await page.goto(`https://www.passwordrandom.com/most-popular-passwords/page/${i}`)
		await page.waitForSelector("#cntContent_lstMain")
		let password = await page.evaluate(() => Array.from(document.querySelectorAll('tbody tr td:nth-child(2)'), element => element.textContent))
		passwords.push(password);
	
	}
    await browser.close()//closes the running process
	fs.writeFileSync('mcupws.json', JSON.stringify(passwords))
}
//creat a fliter function


// array in inside the JSON file
async function main() {
	await getPng()
	let newData = fs.readFileSync('mcupws.json')
	console.log(newData.length)
	//storing our JSON object  to a file named mcupws.json
	//let data = JSON.stringify(keys)
	//fs.writeFileSync('mcupws2.json', data);
	
	

	
}
main()


