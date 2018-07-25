// ==UserScript==
// @name         1Jux User Blocker
// @namespace    https://1jux.net
// @version      0.1
// @description  Hide posts based on a list of usernames
// @author       SFGrenade
// @match        https?://(de|en).1jux.net/*
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// ==/UserScript==

var blocked_users = [
    "TestUser123123123123"
];

function arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
}

window.hide = function() {
    var posts = document.getElementsByClassName("post-item");

    for (var i = 0; i < posts.length; i++) {
        var username = posts[i].children[1].firstChild.firstChild.children[2].firstChild.text;
        if (arrayContains(username, blocked_users)) {
            posts[i].style.display = "none";
        }
    }
};

window.addEventListener("scroll", window.hide, false);
window.hide()