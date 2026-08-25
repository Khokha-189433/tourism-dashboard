import React from 'react'
import DeleteButton from "../../../../components/UI//DeleteButton"
export default function DeleteCategory({CategoryId ,onDeleted }) {
  return (
     <DeleteButton
        endpoint={`/categories/${CategoryId}`}
        itemId={CategoryId}
        onDeleted={onDeleted}
        confirmationMessage="هل أنت متأكد من حذف التصنيف "
        successMessage="تم حذف التصنيف بنجاح"
        errorMessage="حدث خطأ أثناء حذف "
      />
  )
}
