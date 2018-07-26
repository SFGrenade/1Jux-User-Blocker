// ==UserScript==
// @name         1Jux User Blocker
// @namespace    https://1jux.net
// @version      0.1.3
// @description  Hide posts based on a list of usernames
// @author       SFGrenade

// @match        https://de.1jux.net/*
// @match        https://en.1jux.net/*
// @match        http://de.1jux.net/*
// @match        http://en.1jux.net/*

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

const user_string_delimer = " !,! ";
var blocked_users = GM_getValue("BLOCKED_USERS", "");
var expanded = false;

function arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
}

function block_user(username) {
    if (arrayContains(username, blocked_users)) {
        return "User already blocked!";
    }
    blocked_users += ((blocked_users === "") ? "" : user_string_delimer) + username;
    GM_setValue("BLOCKED_USERS", blocked_users);
}

function unblock_user(username) {
    if (!arrayContains(username, blocked_users)) {
        return "User already unblocked!";
    }
    //var tmp = blocked_users.split(user_string_delimer + username);
    var tmp = ("A____" + user_string_delimer + "B___" + user_string_delimer + "CCCC").split(user_string_delimer + username);
    var new_block = "";
    tmp.forEach(function(entry) {
        new_block += entry;
    });
    return new_block;
}
console.log(unblock_user("CCCC"));
console.log(unblock_user("B___"));
console.log(unblock_user("A____"));

function make_button(username, colour_string) {
    var button = document.createElement("span");
    button.textContent = (arrayContains(username, blocked_users) ? "Unblock" : "Block");
    button.title = button.textContent + " " + username;
    return button;
}

function show_blocked_users() {
    if (!expanded) {
        JUX.ajax.fill();
        var ajax_window = document.getElementById("ajax");
        ajax_window.style.color = "red";
    } else {
        JUX.ajax.close();
    }
}

function update_page() {
    console.log("update page");
    var posts = document.getElementsByClassName("post-item");

    for (var i = 0; i < posts.length; i++) {
        // post-item -> l-post-box
        var post_box = posts[i].children[1];
        // l-post-box -> l-post-head-container -> l-post-head -> l-jux-down-tags -> username class object -> text
        var username = post_box.firstChild.firstChild.children[2].getElementsByClassName("username")[0].text;

        if (arrayContains(username, blocked_users)) {
            post_box.getElementsByClassName("post-image").forEach(function(entry) {
                entry.style.display = "none";
            });
            post_box.getElementsByClassName("simple-button").forEach(function(entry) {
                entry.style.display = "none";
            });
        } else {

        }
    }
};

window.onload = () => {
    // First is the under categories, second one is under settings, third one is under profile
    var drop_down_menu = document.getElementsByClassName("drop-link-list")[2];
    drop_down_menu.innerHTML += "<a class=\"drop-link \" href=\"#\"><i class=\"fa fa-ban\"></i> Blocked Users</a>";
    drop_down_menu.lastChild.onclick = function() {
        show_blocked_users();
        return false;
    }
};

window.addEventListener("scroll", update_page, false);
update_page()