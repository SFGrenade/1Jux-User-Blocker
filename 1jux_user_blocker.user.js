// ==UserScript==
// @name         1Jux User Blocker
// @namespace    https://1jux.net
// @version      0.1.1
// @description  Hide posts based on a list of usernames
// @author       SFGrenade

// @match        https?://(de|en).1jux.net/*

// @homepage    https://github.com/SFGrenade/1Jux-User-Blocker
// @downloadURL https://github.com/SFGrenade/1Jux-User-Blocker/raw/master/1jux_user_blocker.user.js
// @updateURL   https://github.com/SFGrenade/1Jux-User-Blocker/raw/master/1jux_user_blocker.user.js

// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// ==/UserScript==

const VERSION = GM_info.script.version;
const AUTHOR = "SFGrenade";

const string_delimer = " !,! ";
var blocked_users = GM_getValue("BLOCKED_USERS", "");

function arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
}

window.onload = () => {
    // First is the under categories, second one is under settings, third one is under profile
    drop_down_menu = document.getElementsByClassName("drop-link-list")[2];
    drop_down_menu.innerHTML += "<a class=\"drop-link \" href=\"#\"><i class=\"fa fa-ban\"></i> Blocked Users</a>";
};

window.hide = function() {
    console.log("Test Hide");
//    var posts = document.getElementsByClassName("post-item");

//    for (var i = 0; i < posts.length; i++) {
//        // post-item -> l-post-box -> l-post-head-container -> l-post-head -> l-jux-down-tags -> first <a> tag -> text
//        var post_box = posts[i].children[1];
//        var username = post_box.firstChild.firstChild.children[2].getElementsByTagName("a")[0].text;
//        var post_images = post_box.getElementsByTagName("a");
//        if (arrayContains(username, blocked_users)) {
//            post_images.forEach(function(entry) {
//                entry.style.display = "none";
//            });
//        }
//    }
};

window.addEventListener("JUX.ajax.es", window.hide, false);
window.hide()