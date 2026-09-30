document.querySelectorAll("#downloadForm").forEach(form=>{
  form.addEventListener("submit", async e=>{
    e.preventDefault();

    const input = form.querySelector("#url");
    const status = form.querySelector("#status");
    const value = input.value.trim();

    if(!/^https?:\/\/(www\.)?tiktok\.com\//i.test(value)){
      status.textContent = "Please enter a supported TikTok URL.";
      return;
    }

    status.textContent =
      "Link accepted. The download backend will be connected later.";
  });
});
