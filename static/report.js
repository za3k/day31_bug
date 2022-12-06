'use strict';

function makeReporter(stub) {
    const reporter = document.getElementById("bug-reporter");
    if (reporter) reporter.remove();
    
    if (!!stub) { // First time 'stub' is an event
        document.body.insertAdjacentHTML("beforeend", `
            <div id="bug-reporter" style="position: fixed; bottom:0; right: 0; margin: 0; border: 2px solid; border-radius: 10px; padding: 4px; text-decoration: none; font-size: 18pt; background-color:white; z-index: 99;">
                <a href="#report" onclick="makeReporter(0)">Report bug</a>
            </div>
        `);
        return;
    }


    const id = Math.floor(Math.random()*1000000000);

    const url = window.location.href;

    let project = window.location.href.split("/")[3];
    if (project=="hackaday") project = `hack-a-${window.location.href.split("/")[4]}`

    const d = new Date()
    const date = `${d.getUTCFullYear()}-${(d.getUTCMonth()+1).toString().padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')}`;
    const time = `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}:${d.getUTCSeconds().toString().padStart(2, '0')}`;
    const datetime = `${date} ${time} UTC`;

    document.body.insertAdjacentHTML("beforeend", `
        <form method="POST" action="/hackaday/bug/report" id="bug-reporter" style="position: fixed; bottom:0; right: 0; border: 2px solid; margin: 0; z-index:99; background-color: white;" enctype="multipart/form-data">
        <table>
            <tr><td colspan="2">
                Bug Reporter
                <a href="#" onclick="makeReporter(1)" style="float: right; font-weight: bold">X</a>
            </td></tr>
            <tr><td>report id</td><td>
                <input type="hidden" name="id" value="${id}"/>
                ${id}
            </td></tr>
            <tr><td>date, time</td><td>
                <input type="hidden" name="date" value="${datetime}"/>
                ${datetime}
            </td></tr>
            <tr><td>type</td><td>
                <select name="type">
                    <option value="incomplete">Select one...</option>
                    <option value="compliment">I like this</option>
                    <option value="bug">This doesn't work for me</option>
                    <option value="bug">Something is broken</option>
                    <option value="bug">Something is wrong</option>
                    <option value="feature">You should add something cool</option>
                    <option value="feature">You should make this better</option>
                    <option value="project">You should do another project</option>
                </select>
            </td></tr>
            <tr><td>url</td><td>
                <input type="hidden" name="url" value="${url}"/>
                ${url}
            </td></tr>
            <tr><td>project</td><td>
                <input type="hidden" name="project" value="${project}"/>
                ${project}
            </td></tr>
            <tr><td>screenshot (optional)</td><td>
                <input type="file" name="screenshot" multiple/>
            </td></tr>
            <tr><td>contact (optional)</td><td>
                <input type="text" name="contact" placeholder="me@gmail.com, zachary#4444, etc" style="width:100%" />
            </td></tr>
            <tr><td>description</td><td>
                <textarea name="description" style="width: 100%; min-height: 200px;">What I did:

What I expected to happen:

What actually happened:
</textarea>
                </td></tr>
            <tr><td colspan="2">
                <input type="submit" name="submit" value="report" />
            </td></tr>

        </table>
        </form>
    `);
}

(function() {
    function docReady(fn) { // https://stackoverflow.com/questions/9899372/vanilla-javascript-equivalent-of-jquerys-ready-how-to-call-a-function-whe. Avoiding jquery because it's messing up error display
        if (document.readyState === "complete" || document.readyState === "interactive") setTimeout(fn, 1);
        else document.addEventListener("DOMContentLoaded", fn);
    }
    docReady(makeReporter);
})();
