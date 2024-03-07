
const Table = ({ transactions }) => {
    return (
      // Add classes for outer styling and responsiveness
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="min-w-full table-auto border border-black bg-yellow-200 rounded-xl">
            <thead className="bg-black text-white">
                <tr>
                    <th className="px-4 py-2">Id</th>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Sold</th>
                    <th className="px-4 py-2">Image</th>
                </tr>
            </thead>
            <tbody>
            {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-black border-solid hover:bg-yellow-100">
                    <td className="text-center px-4 py-2">{transaction.id}</td>
                    <td className="text-center px-4 py-2">{transaction.title}</td>
                    <td className="text-center px-4 py-2 line-clamp-3">{transaction.description}</td>
                    <td className="text-center px-4 py-2">{transaction.price}</td>
                    <td className="text-center px-4 py-2">{transaction.category}</td>
                    <td className="text-center px-4 py-2">{transaction.sold ? 'Yes' : 'No'}</td>
                    <td className="text-center px-4 py-2">
                        <a href={transaction.image} alt={transaction.productTitle}>View Image</a>
                        {/* <img src={} alt={transaction.productTitle} className="h-10 w-10 rounded-full mx-auto"/> */}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    )
  }
  
  export default Table;
  