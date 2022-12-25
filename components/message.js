function getMessageHTML(name, message) {
  return `
            <div class="flex hover:bg-gray-100 w-full py-3 pl-3">
                <div>
                    <img src="/images/user-img.png" class="w-10" />
                </div>
                <div class="ml-3">
                    <span class="font-semibold">${name}</span>
                    <p>${message}</p>
                </div>
            </div>
         `;
}

export default getMessageHTML;
