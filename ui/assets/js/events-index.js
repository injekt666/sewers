
/* Set events for index.html */

	// Make console resizable.
	topbar.addEventListener("mousedown", async event => {
		resizeConsole = true
		dragStart = event.clientY
	})
	topbar.addEventListener("touchstart", async event => {
		resizeConsole = true
		dragStart = event.clientY
	})
	document.addEventListener("mousemove", async event => {
		if (!resizeConsole) {
			return
		}
		offset = document.body.getBoundingClientRect().height - event.clientY
		if ( event.clientY > 75 && event.clientY < ( document.body.getBoundingClientRect().height - 50 ) ) {
			webConsole.style.height = offset + "px"
			topbar.style.bottom = (offset - 1) + "px"
			scrollContainer.style.height = "calc(100% - " + offset + "px)"
		}
	})
	document.addEventListener("touchmove", async event => {
		if (!resizeConsole) {
			return
		}
		offset = document.body.getBoundingClientRect().height - event.clientY
		if ( event.clientY > 75 && event.clientY < ( document.body.getBoundingClientRect().height - 50 ) ) {
			webConsole.style.height = offset + "px"
			topbar.style.bottom = (offset - 1) + "px"
			scrollContainer.style.height = "calc(100% - " + offset + "px)"
		}
	})
	document.addEventListener("mouseup", async event => {
		if (resizeConsole) {
			$.ajax({
				method: "post",
				url: "/config/sewers",
				dataType: "json",
				data: "console_height=" + webConsole.getBoundingClientRect().height
			})
		}
		resizeConsole = false
	})
	document.addEventListener("touchend", async event => {
		if (resizeConsole) {
			req = new XMLHttpRequest()
			req.open("POST", "/config/sewers")
			$.ajax({
				method: "post",
				url: "/config/sewers",
				dataType: "json",
				data: "console_height=" + webConsole.getBoundingClientRect().height
			})
		}
		resizeConsole = false
	})

	// Prevent console from being hidden when resizing window.
	self.addEventListener("resize", async()=>{
		if ( webConsole.getBoundingClientRect().height >= ( document.body.getBoundingClientRect().height - 75 ) && webConsole.getBoundingClientRect().height > 51 ) {
			webConsole.style.height = ( document.body.getBoundingClientRect().height - 75 ) + "px"
			topbar.style.bottom = (document.body.getBoundingClientRect().height - 75 - 1) + "px"
			scrollContainer.style.height = "calc(100% - " + ( document.body.getBoundingClientRect().height - 75 ) + "px)"
			$.ajax({
				method: "post",
				url: "/config/sewers",
				dataType: "json",
				data: "console_height=" + webConsole.getBoundingClientRect().height
			})
		}
	})

	// Console "CLEAR" button
	consoleClear.addEventListener("click", async()=>{
		$.ajax({
			method: "get",
			url: "/clear_console_log",
			async: false,
			success: () => {
				consoleContainer.html("")
			}
		})
		await fetchLog()
	})

	// (change this) Fetch log when user is active on window
	document.addEventListener("mouseenter", async()=>{
		await fetchLog()
	})

	// Quit button
	document.querySelector("html body div.menu div[name=quit]").addEventListener("click", ()=>{
		showMessage("Quit?", "Do you want to close sewers?<br><div class=\"button\" onclick=\"quit()\">Yes</div><div class=\"button\" onclick=\"hideMessage()\">No</div>")
	})

	// Preferences button
	document.querySelector("html body div.menu div.item[name=settings]").addEventListener("click", ()=>{
		showPreferences()
	})

	document.querySelector("html body div.fade div.modalbox div.optionbox ul li").addEventListener("mousedown", event=>{
		document.querySelectorAll("html body div.fade div.modalbox div.optionbox ul li").forEach(li=>{
			li.classList.remove("selected")
		})
		event.target.classList.add("selected")
	})

	backbutton.addEventListener("click", event=>{
		event.target.classList.add("hidden")
		showRelays()
	})

	menuCancel.addEventListener("click", ()=>{
		hideMenu()
	})