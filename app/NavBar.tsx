export default function NavBar() {
    return (
        <div className="w-full flex items-center justify-center h-[75px]">
        <div className="w-[1200px] flex flex-row justify-between p-4 bg-gray-200 mt-3 rounded-xl">
          <h2>Logo</h2>
          <div className="flex flex-row gap-2">
            <h2>Contact</h2>
            <h2>Button</h2>
          </div>
        </div>
      </div>
    )
}