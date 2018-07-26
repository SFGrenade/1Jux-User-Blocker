// ==UserScript==
// @name         1Jux User Blocker
// @namespace    https://1jux.net
// @version      0.2.4
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
    location.reload();
}

function unblock_user(username) {
    if (!arrayContains(username, blocked_users)) {
        return "User already unblocked!";
    }

    blocked_users.splice(blocked_users.indexOf(username));

    blocked_users_string = blocked_users.join(user_string_delimer);
    GM_setValue("BLOCKED_USERS", blocked_users_string);
    location.reload();
}

function make_block_button(username) {
    var button = document.createElement("span");
    button.className = "user_blocker_button";
    if (arrayContains(username, blocked_users)) {
        button.textContent = "Unblock";
        button.style.color = "green";
        button.onclick = function() {
            unblock_user(username);
            return false;
        }
    } else {
        button.textContent = "Block";
        button.style.color = "red";
        button.onclick = function() {
            block_user(username);
            return false;
        }
    }
    button.title = button.textContent + " " + username;
    button.style.cursor = "pointer";
    return button;
}

function make_list_entry(username) {
    var entry = document.createElement("li");
    entry.appendChild(make_block_button(username));
    var username_text = document.createElement("p");
    username_text.textContent = username;
    entry.appendChild(username_text);
    return entry;
}

function show_blocked_users() {
    if (!expanded) {
        JUX.ajax.fill();
        var ajax_window = document.getElementById("ajax");

        ajax_window.innerHTML = "";

        var heading = document.createElement("h2");
        heading.textContent = "1Jux User Blocker";
        heading.style.textAlign = "center";

        var subheading = document.createElement("h4");
        subheading.textContent = "Version " + VERSION + " (by " + AUTHOR + ")";
        subheading.style.textAlign = "center";

        var user_list = document.createElement("ul");
        user_list.style.width = "100%";
        blocked_users.forEach(function(entry) {
            if (entry != "") {
                user_list.appendChild(make_list_entry(entry));
            }
        });

        var close_button = document.createElement("span");
        close_button.style.color = "white";
        close_button.style.backgroundColor = "red";
        close_button.textContent = "close";
        close_button.title = "Close window";
        close_button.style.cursor = "pointer";
        close_button.onclick = function() {
            show_blocked_users(username);
            return false;
        }

        ajax_window.appendChild(heading);
        ajax_window.appendChild(subheading);
        ajax_window.appendChild(user_list);
        ajax_window.appendChild(close_button);
        expanded = true;
    } else {
        JUX.ajax.close();
        expanded = false;
    }
}

function update_page() {
    var posts = document.getElementsByClassName("post-item");

    for (var i = 0; i < posts.length; i++) {
        // post-item -> l-post-box
        var post_box = posts[i].getElementsByClassName("l-post-box")[0];
        // l-post-box -> l-jux-down-title -> title
        var title_element = post_box.getElementsByClassName("l-jux-down-title")[0].getElementsByClassName("title")[0];
        // l-post-box -> l-post-head-container -> l-post-head -> l-jux-down-tags
        var username_area = post_box.getElementsByClassName("l-post-head-container")[0].getElementsByClassName("l-post-head")[0].getElementsByClassName("l-jux-down-tags")[0];
        // l-jux-down-tags -> username class object -> text
        var username = username_area.getElementsByClassName("username")[0].text;

        if (username_area.getElementsByClassName("user_blocker_button").length < 1) {
            var tmp_span = document.createElement("span");
            tmp_span.className = "seperator";
            tmp_span.textContent = "·";
            username_area.appendChild(tmp_span);
            username_area.appendChild(document.createTextNode(""));
            username_area.appendChild(make_block_button(username));
        }

        if (arrayContains(username, blocked_users)) {
            Array.prototype.forEach.call(post_box.getElementsByClassName("post-image"), entry => {
                entry.style.display = "none";
            });
            Array.prototype.forEach.call(post_box.getElementsByClassName("simple-button"), entry => {
                entry.style.display = "none";
            });
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