import frappe

@frappe.whitelist()
def get_todos():
    return frappe.get_all('todo app', fields=['name', 'description', 'status'])

@frappe.whitelist()
def create_todo(description, status):
    doc = frappe.new_doc('todo app')
    doc.description = description
    doc.status = status
    doc.insert()
    return doc.name

@frappe.whitelist()
def update_todo(name, description=None, status=None):
    doc = frappe.get_doc('todo app', name)
    if description:
        doc.description = description
    if status:
        doc.status = status
    doc.save()
    return doc.name

@frappe.whitelist()
def delete_todo(name):
    frappe.delete_doc('todo app', name)
    return name
