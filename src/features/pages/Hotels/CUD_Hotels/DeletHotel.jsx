import DeleteButton from "../../../../components/UI/DeleteButton";

// زر حذف الفندق مع تأكيد العملية والتعامل مع طلب الحذف.
export default function DeleteHotel({ hotelId, onDeleted }) {
	return (
		<DeleteButton
			endpoint={`/hotels/${hotelId}`}
			itemId={hotelId}
			onDeleted={onDeleted}
			confirmationMessage="هل أنت متأكد من حذف الفندق؟"
			successMessage="تم حذف الفندق بنجاح"
			errorMessage="حدث خطأ أثناء حذف الفندق"
		/>
	);
}
