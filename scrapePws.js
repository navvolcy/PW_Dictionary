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
	for (let i = 0; i < 50; i++) {
		await page.goto(`https://www.passwordrandom.com/most-popular-passwords/page/${i}`)
		await page.waitForSelector("#cntContent_lstMain")
		let password = await page.evaluate(() => Array.from(document.querySelectorAll('tbody tr td:nth-child(2)'), element => element.textContent))
		passwords.push(password);
		
	}
	
    await browser.close()//closes the running process
	
}
//get 10,000 of the most used password from site
//push the password into an array 
const mostFrequent = (passwords= [], num = 1) => {
	const map = {}
	let keys = []
	for (let i = 0; i < passwords.length; i++){
		if (map[passwords[i]]) {
			map[passwords[i]]++
		}else {
			map[passwords[i]] = 1
		}
	}
	for (let i in map) {
		keys.push(i)
	}
	keys = keys.sort((a,b) => {
		if (map[a] === map[b]) {

			if (a > b) {
				return 1
			} else {
				return -1
			}
		}
		else{
			return map[b] - map[a]
		}
	})
	.slice(0,num)
	return keys

}



// array in inside the JSON file
async function main() {
	await getPng()
	//mostFrequent(passwords, 10000) stored in keys variable
	let keys = mostFrequent(passwords, 10000)
	//storing our JSON object  to a file named mcupws.json
	let data = JSON.stringify(keys)
	fs.writeFileSync('mcupws.json', data);
	
}
main()


