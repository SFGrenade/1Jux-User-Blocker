// ==UserScript==
// @name         1Jux User Blocker
// @namespace    https://1jux.net
// @version      0.1.4
// @description  Blocks users' posts and maybe other stuff sometime
// @author       SFGrenade

// @match        *://de.1jux.net/*
// @match        *://en.1jux.net/*

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
var blocked_users_string = GM_getValue("BLOCKED_USERS", "");
var blocked_users = blocked_users_string.split(user_string_delimer);
var expanded = false;

function arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
}

function block_user(username) {
    if (arrayContains(username, blocked_users)) {
        return "User already blocked!";
    }

    blocked_users.push(username);

    blocked_users_string = blocked_users.join(user_string_delimer);
    GM_setValue("BLOCKED_USERS", blocked_users_string);
    return "User successfully blocked!";
}

function unblock_user(username) {
    if (!arrayContains(username, blocked_users)) {
        return "User already unblocked!";
    }

    blocked_users.splice(blocked_users.indexOf(username));

    blocked_users_string = blocked_users.join(user_string_delimer);
    GM_setValue("BLOCKED_USERS", blocked_users_string);
    return "User successfully unblocked!";
}

function make_block_button(username) {
    var button = document.createElement("span");
    if (arrayContains(username, blocked_users)) {
        button.textContent = "Unblock";
        button.style.color = "green";
    } else {
        button.textContent = "Block";
        button.style.color = "red";
    }
    button.title = button.textContent + " " + username;
    button.style.cursor = "pointer";
    return button;
}

function make_list_entry(username) {
    var entry = document.createElement("li");
    entry.appendChild(make_block_button(username));
    return entry;
}

function show_blocked_users() {
    if (!expanded) {
        JUX.ajax.fill();
        var ajax_window = document.getElementById("ajax");

        var heading = document.createElement("h2");
        heading.textContent = "1Jux User Blocker";
        heading.appendChild(document.createElement("h4"));
        heading.lastChild.textContent = "Version " + VERSION + " (by " + AUTHOR + ")"

        var user_list = document.createElement("ul");
        blocked_users.forEach(function(entry) {
            if (entry != "") {
                user_list.appendChild(make_list_entry(entry));
            }
        });
        ajax_window.appendChild(user_list);

        expanded = true;
    } else {
        JUX.ajax.close();
        expanded = false;
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