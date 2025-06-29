document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURACIÓN Y CONSTANTES GLOBALES ---
    const API_BASE_URL = 'http://localhost/inventario/api'; // Ajusta esto si tu API está en otra URL
    const MONEDA = '$';
    const MAX_ITEMS_FACTURA = 15;

    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---

    // Modales
    const motivoAnulacionModalEl = document.getElementById('motivoAnulacionModal');
    const motivoAnulacionModal = motivoAnulacionModalEl ? new bootstrap.Modal(motivoAnulacionModalEl) : null;
    const confirmDeleteModalEl = document.getElementById('confirmDeleteModal');
    const confirmDeleteModal = confirmDeleteModalEl ? new bootstrap.Modal(confirmDeleteModalEl) : null;
    const registrarPagoModalEl = document.getElementById('registrarPagoModal');
    const registrarPagoModal = registrarPagoModalEl ? new bootstrap.Modal(registrarPagoModalEl) : null;
    const historialPagosModalEl = document.getElementById('historialPagosModal');
    const historialPagosModal = historialPagosModalEl ? new bootstrap.Modal(historialPagosModalEl) : null;

    // Login y App Containers
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    const logoutBtn = document.getElementById('logout-btn');

    // Resumen
    const statTotalProductosEl = document.getElementById('stat-total-productos');
    const statBajoStockEl = document.getElementById('stat-bajo-stock');
    const statValorTotalEl = document.getElementById('stat-valor-total');
    const statTotalFacturasEl = document.getElementById('stat-total-facturas');
    const resumenCardsContainer = document.getElementById('resumen-cards-container');
    const resumenLoadingPlaceholder = document.getElementById('resumen-loading-placeholder');
    const resumenErrorPlaceholder = document.getElementById('resumen-error-placeholder');

    // Formulario Nuevo Producto
    const formNuevoProducto = document.getElementById('form-nuevo-producto');
    const inputDepto = document.getElementById('producto-departamento');
    const inputDesc = document.getElementById('producto-descripcion');
    const selectMedida = document.getElementById('producto-medida');
    const mensajeProducto = document.getElementById('mensaje-producto');

    // Formulario Clientes
    const formCliente = document.getElementById('form-cliente');
    const inputClienteIdEdit = document.getElementById('cliente-id-edit');
    const inputClienteNombre = document.getElementById('cliente-nombre');
    const inputClienteCodigoAlfanumerico = document.getElementById('cliente-codigo-alfanumerico');
    const inputClienteIdentificacion = document.getElementById('cliente-identificacion');
    const inputClienteTelefono = document.getElementById('cliente-telefono');
    const inputClienteDireccion = document.getElementById('cliente-direccion');
    const inputClienteEmail = document.getElementById('cliente-email');
    const inputClienteActivo = document.getElementById('cliente-activo');
    const clienteFormTitle = document.getElementById('cliente-form-title');
    const btnCancelarClienteEdicion = document.getElementById('btn-cancelar-cliente-edicion');
    const mensajeCliente = document.getElementById('mensaje-cliente');
    const cuerpoTablaClientes = document.getElementById('cuerpo-tabla-clientes');

    // Formulario Proveedores
    const formProveedor = document.getElementById('form-proveedor');
    const inputProveedorIdEdit = document.getElementById('proveedor-id-edit');
    const inputProveedorNombre = document.getElementById('proveedor-nombre');
    const inputProveedorCodigoAlfanumerico = document.getElementById('proveedor-codigo-alfanumerico');
    const inputProveedorIdentificacion = document.getElementById('proveedor-identificacion');
    const inputProveedorTelefono = document.getElementById('proveedor-telefono');
    const inputProveedorDireccion = document.getElementById('proveedor-direccion');
    const inputProveedorEmail = document.getElementById('proveedor-email');
    const inputProveedorActivo = document.getElementById('proveedor-activo');
    const proveedorFormTitle = document.getElementById('proveedor-form-title');
    const btnCancelarProveedorEdicion = document.getElementById('btn-cancelar-proveedor-edicion');
    const mensajeProveedor = document.getElementById('mensaje-proveedor');
    const cuerpoTablaProveedores = document.getElementById('cuerpo-tabla-proveedores');

    // Formulario Movimiento
    const formAjuste = document.getElementById('form-movimiento');
    const inputAjusteProducto = document.getElementById('movimiento-producto-input');
    const hiddenAjusteProductoId = document.getElementById('movimiento-producto-id');
    const selectAjusteTipo = document.getElementById('movimiento-tipo');
    const precioContainer = document.getElementById('precio-container');
    const inputAjustePrecio = document.getElementById('movimiento-precio');
    const proveedorContainer = document.getElementById('proveedor-container');
    const inputAjusteProveedor = document.getElementById('movimiento-proveedor');
    const clienteContainer = document.getElementById('cliente-container');
    const inputAjusteCliente = document.getElementById('movimiento-cliente');
    const inputAjusteCantidad = document.getElementById('movimiento-cantidad');
    const inputAjusteFecha = document.getElementById('movimiento-fecha');
    const mensajeAjuste = document.getElementById('mensaje-movimiento');

    // Tablas
    const cuerpoTablaInventario = document.getElementById('cuerpo-tabla-inventario');
    const cuerpoTablaHistorial = document.getElementById('cuerpo-tabla-historial');
    const cuerpoTablaHistorialFacturas = document.getElementById('cuerpo-tabla-historial-facturas');
    const cuerpoTablaCXC = document.getElementById('cuerpo-tabla-cxc');

    // Facturación
    const formFactura = document.getElementById('form-factura');
    const facturaFecha = document.getElementById('factura-fecha');
    const inputFacturaCliente = document.getElementById('factura-cliente-input');
    const datalistFacturaClientes = document.getElementById('factura-clientes-lista');
    const hiddenFacturaClienteId = document.getElementById('factura-cliente-id-hidden');
    const selectFacturaCondicionPago = document.getElementById('factura-condicion-pago');
    const facturaFechaVencimientoContainer = document.getElementById('factura-fecha-vencimiento-container');
    const inputFacturaFechaVencimiento = document.getElementById('factura-fecha-vencimiento');
    const cuerpoTablaFacturaItems = document.getElementById('cuerpo-tabla-factura-items');
    const btnAddFacturaItem = document.getElementById('btn-add-factura-item');
    const facturaTotalDisplay = document.getElementById('factura-total-display');
    const btnGuardarFactura = document.getElementById('btn-guardar-factura');
    const mensajeFactura = document.getElementById('mensaje-factura');
    const datalistProductos = document.getElementById('productos-lista'); // <-- AÑADIDO: Esta variable faltaba

    // Facturación Compra
    const formFacturaCompra = document.getElementById('form-factura-compra');
    const facturaCompraFecha = document.getElementById('factura-compra-fecha');
    const inputFacturaCompraProveedor = document.getElementById('factura-compra-proveedor-input');
    const datalistFacturaProveedores = document.getElementById('factura-proveedores-lista');
    const hiddenFacturaCompraProveedorId = document.getElementById('factura-compra-proveedor-id-hidden');
    const cuerpoTablaFacturaCompraItems = document.getElementById('cuerpo-tabla-factura-compra-items');
    const btnAddFacturaCompraItem = document.getElementById('btn-add-factura-compra-item');
    const facturaCompraTotalDisplay = document.getElementById('factura-compra-total-display');
    const btnGuardarFacturaCompra = document.getElementById('btn-guardar-factura-compra');
    const mensajeFacturaCompra = document.getElementById('mensaje-factura-compra');

    // Cuentas por Cobrar (CXC)
    const tabCXCButton = document.getElementById('tab-cxc');
    const selectFiltroCXCCliente = document.getElementById('filtro-cxc-cliente');
    const selectFiltroCXCEstado = document.getElementById('filtro-cxc-estado');
    const inputFiltroCXCFacturaId = document.getElementById('filtro-cxc-factura-id');
    const btnAplicarFiltroCXC = document.getElementById('btn-aplicar-filtro-cxc');
    const limpiarFiltroCXCBtn = document.getElementById('limpiar-filtro-cxc');
    const formRegistrarPago = document.getElementById('form-registrar-pago');
    const inputPagoFacturaId = document.getElementById('pago-factura-id');
    const displayPagoModalFacturaId = document.getElementById('pago-modal-factura-id-display');
    const displayPagoModalClienteNombre = document.getElementById('pago-modal-cliente-nombre-display');
    const displayPagoModalSaldoActual = document.getElementById('pago-modal-saldo-actual-display');
    const inputPagoMonto = document.getElementById('pago-monto');
    const inputPagoFecha = document.getElementById('pago-fecha');
    const selectPagoMetodo = document.getElementById('pago-metodo');
    const inputPagoReferencia = document.getElementById('pago-referencia');
    const textareaPagoObservaciones = document.getElementById('pago-observaciones');
    const mensajePagoModal = document.getElementById('mensaje-pago-modal');
    const btnConfirmarPago = document.getElementById('btn-confirmar-pago');

    // Historial Pagos Modal
    const displayHistorialPagosFacturaId = document.getElementById('historial-pagos-factura-id-display');
    const displayHistorialPagosClienteNombre = document.getElementById('historial-pagos-cliente-nombre-display');
    const displayHistorialPagosTotalFactura = document.getElementById('historial-pagos-total-factura-display');
    const displayHistorialPagosSaldoPendiente = document.getElementById('historial-pagos-saldo-pendiente-display');
    const cuerpoTablaHistorialPagos = document.getElementById('cuerpo-tabla-historial-pagos');
    const mensajeHistorialPagosModal = document.getElementById('mensaje-historial-pagos-modal');
    const historialPagosLoading = document.getElementById('historial-pagos-loading');

    // Anulación Modal
    const formMotivoAnulacion = document.getElementById('form-motivo-anulacion');
    const displayAnularFacturaId = document.getElementById('anular-factura-id-display');
    const inputAnularFacturaId = document.getElementById('anular-factura-id-input');
    const textareaMotivoAnulacion = document.getElementById('motivo-anulacion-texto');
    const mensajeMotivoAnulacionModal = document.getElementById('mensaje-motivo-anulacion-modal');
    const btnConfirmarAnulacion = document.getElementById('btn-confirmar-anulacion');

    // Elementos Generales
    const mensajeGlobalContainer = document.getElementById('mensaje-global');
    const printableArea = document.getElementById('printable-factura');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const confirmDeleteMessage = document.getElementById('confirmDeleteMessage');
    let confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    // Filtros Inventario
    const filtroInventarioTexto = document.getElementById('filtro-inventario-texto');
    const filtroInventarioStock = document.getElementById('filtro-inventario-stock');
    const filtroInventarioESFechaInicio = document.getElementById('filtro-inventario-es-fecha-inicio');
    const filtroInventarioESFechaFin = document.getElementById('filtro-inventario-es-fecha-fin');
    const limpiarFiltroInventarioBtn = document.getElementById('limpiar-filtro-inventario');
    const inventarioPaginationControls = document.getElementById('inventario-pagination-controls');
    const inventarioLimitSelect = document.getElementById('inventario-limit-select');
    const inventarioPaginationInfo = document.getElementById('inventario-pagination-info');
    const inventarioBtnPrimera = document.getElementById('inventario-btn-primera');
    const inventarioBtnAnterior = document.getElementById('inventario-btn-anterior');
    const inventarioPageDisplay = document.getElementById('inventario-page-display');
    const inventarioBtnSiguiente = document.getElementById('inventario-btn-siguiente');
    const inventarioBtnUltima = document.getElementById('inventario-btn-ultima');

    // Filtros Historial Movimientos
    const filtroHistorialTexto = document.getElementById('filtro-historial-texto');
    const filtroHistorialTipo = document.getElementById('filtro-historial-tipo');
    const filtroHistorialFechaInicio = document.getElementById('filtro-historial-fecha-inicio');
    const filtroHistorialFechaFin = document.getElementById('filtro-historial-fecha-fin');
    const limpiarFiltroHistorialBtn = document.getElementById('limpiar-filtro-historial');
    const historialMovimientosPaginationControls = document.getElementById('historial-movimientos-pagination-controls');
    const historialLimitSelect = document.getElementById('historial-limit-select');
    const historialPaginationInfo = document.getElementById('historial-pagination-info');
    const historialBtnPrimera = document.getElementById('historial-btn-primera');
    const historialBtnAnterior = document.getElementById('historial-btn-anterior');
    const historialPageDisplay = document.getElementById('historial-page-display');
    const historialBtnSiguiente = document.getElementById('historial-btn-siguiente');
    const historialBtnUltima = document.getElementById('historial-btn-ultima');

    // Filtros Historial Facturas
    const filtroFacturasTexto = document.getElementById('filtro-facturas-texto');
    const filtroFacturasFechaInicio = document.getElementById('filtro-facturas-fecha-inicio');
    const filtroFacturasFechaFin = document.getElementById('filtro-facturas-fecha-fin');
    const filtroFacturasEstadoPago = document.getElementById('filtro-facturas-estado-pago');
    const filtroFacturasVerAnuladas = document.getElementById('filtro-facturas-ver-anuladas');
    const limpiarFiltroFacturasBtn = document.getElementById('limpiar-filtro-facturas');
    const histfactPaginationControls = document.getElementById('historial-facturas-pagination-controls');
    const histfactLimitSelect = document.getElementById('histfact-limit-select');
    const histfactPaginationInfo = document.getElementById('histfact-pagination-info');
    const histfactBtnPrimera = document.getElementById('histfact-btn-primera');
    const histfactBtnAnterior = document.getElementById('histfact-btn-anterior');
    const histfactPageDisplay = document.getElementById('histfact-page-display');
    const histfactBtnSiguiente = document.getElementById('histfact-btn-siguiente');
    const histfactBtnUltima = document.getElementById('histfact-btn-ultima');

    // Datos (Import/Export)
    const btnExportarDatos = document.getElementById('btn-exportar-datos');
    const inputImportarDatos = document.getElementById('input-importar-datos');
    const mensajeDatos = document.getElementById('mensaje-datos');

    // --- ESTADO GLOBAL DE LA APLICACIÓN ---
    let listaProductosGlobal = [];
    let listaClientesGlobal = [];
    let listaProveedoresGlobal = [];
    let currentUserRole = null;
    let deleteCallback = null;

    // Estado de paginación
    let inventarioCurrentPage = 1, inventarioLimit = 25, inventarioTotalPages = 0, inventarioTotalRecords = 0;
    let inventarioFiltrosActuales = { texto: '', stock: '', esFechaInicio: '', esFechaFin: '' };
    
    let historialMovimientosCurrentPage = 1, historialMovimientosLimit = 25, historialMovimientosTotalPages = 0, historialMovimientosTotalRecords = 0;
    let historialMovimientosFiltrosActuales = { texto: '', tipo: '', fechaInicio: '', fechaFin: '' };

    let histFacturasCurrentPage = 1, histFacturasLimit = 25, histFacturasTotalPages = 0, histFacturasTotalRecords = 0;
    let histFacturasFiltrosActuales = { texto: '', fechaInicio: '', fechaFin: '', ver_anuladas: false, estado_pago: '' };

    // --- FUNCIONES UTILITARIAS ---
    
    const mostrarMensaje = (el, txt, tipo = 'success', dur = 4000) => {
        if (!el) { console.error("Elemento de mensaje no encontrado:", el); return; }
        if (el.id === 'mensaje-global') {
            const toastId = 'toast-' + Date.now();
            const toastHTML = `
                <div id="${toastId}" class="toast align-items-center text-bg-${tipo} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="${dur}">
                    <div class="d-flex">
                        <div class="toast-body">${txt}</div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>`;
            el.insertAdjacentHTML('beforeend', toastHTML);
            const toastElement = document.getElementById(toastId);
            if (!toastElement) return;
            const toast = new bootstrap.Toast(toastElement);
            toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
            toast.show();
            return;
        }
        if (el.timerId) clearTimeout(el.timerId);
        el.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">${txt}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
        el.style.display = 'block';
        const alertElement = el.querySelector('.alert');
        if (!alertElement) return;
        if (dur > 0) {
            el.timerId = setTimeout(() => {
                const currentAlert = el.querySelector('.alert');
                if (currentAlert && currentAlert.textContent.includes(txt)) {
                    const bsAlert = bootstrap.Alert.getOrCreateInstance(currentAlert);
                    if (bsAlert) bsAlert.close();
                    else { el.innerHTML = ''; el.style.display = 'none'; }
                }
                delete el.timerId;
            }, dur);
        }
    };

    const formatCurrency = (value) => (typeof value === 'number' && !isNaN(value)) ? `${value.toFixed(2)} ${MONEDA}` : (typeof value !== 'undefined' && value !== null ? `${Number(value).toFixed(2)} ${MONEDA}` : '-');
    const formatNumber = (value, decimals = 0) => (typeof Number(value) === 'number' && !isNaN(Number(value))) ? Number(value).toFixed(decimals) : (0).toFixed(decimals);

    // --- COMUNICACIÓN CON LA API ---

    const fetchData = async (endpoint, options = {}) => {
        console.log(`[fetchData] Realizando fetch a: ${endpoint}`);
        const defaultOptions = { credentials: 'include' };
        const finalOptions = { ...defaultOptions, ...options };
        if (options.headers) {
            finalOptions.headers = { ...defaultOptions.headers, ...options.headers };
        }
        const url = `${API_BASE_URL}/${endpoint}`;
        try {
            const response = await fetch(url, finalOptions);
            const responseData = await response.json();
            console.log(`[fetchData] Respuesta de ${endpoint}:`, responseData);
            if (!response.ok) {
                const errorMessage = responseData.message || `Error HTTP ${response.status}`;
                if (response.status === 401 && loginContainer && appContainer) {
                    mostrarMensaje(loginMessage, `Sesión expirada o no autorizado. Inicie sesión. (${errorMessage})`, 'warning');
                    appContainer.style.display = 'none';
                    loginContainer.style.display = 'block';
                    sessionStorage.removeItem('currentUserRole');
                    currentUserRole = null;
                }
                throw new Error(errorMessage);
            }
            if (responseData.hasOwnProperty('success') && !responseData.success) {
                console.warn("API call reported failure:", responseData);
                if (responseData.debug_info) console.warn("Debug Info:", responseData.debug_info);
                throw new Error(responseData.message || 'La operación falló.');
            }
            return responseData;
        } catch (error) {
            console.error(`[fetchData] Error en ${endpoint}:`, error);
            mostrarMensaje(mensajeGlobalContainer, `Error de API: ${error.message || error}`, 'danger', 6000);
            throw error;
        }
    };

    const cargarProductosAPI = (page = 1, limit = 25, filtros = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (filtros.texto && filtros.texto.trim() !== '') params.append('filtro_texto', filtros.texto.trim());
        if (filtros.stock && filtros.stock !== 'todos') params.append('filtro_stock', filtros.stock);
        if (filtros.esFechaInicio) params.append('filtro_es_fecha_inicio', filtros.esFechaInicio);
        if (filtros.esFechaFin) params.append('filtro_es_fecha_fin', filtros.esFechaFin);
        return fetchData(`productos.php?${params.toString()}`);
    };

    const cargarMovimientosAPI = (page = 1, limit = 25, filtros = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (filtros.texto && filtros.texto.trim() !== '') params.append('filtro_texto', filtros.texto.trim());
        if (filtros.tipo) params.append('filtro_tipo', filtros.tipo);
        if (filtros.fechaInicio) params.append('filtro_fecha_inicio', filtros.fechaInicio);
        if (filtros.fechaFin) params.append('filtro_fecha_fin', filtros.fechaFin);
        return fetchData(`movimientos.php?${params.toString()}`);
    };
    
    const cargarListaFacturasAPI = (page = 1, limit = 25, filtros = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (filtros.texto) params.append('filtro_texto', filtros.texto.trim());
        if (filtros.fechaInicio) params.append('filtro_fecha_inicio', filtros.fechaInicio);
        if (filtros.fechaFin) params.append('filtro_fecha_fin', filtros.fechaFin);
        if (filtros.estado_pago) params.append('filtro_estado_pago', filtros.estado_pago);
        if (filtros.ver_anuladas) params.append('ver_anuladas', '1');
        return fetchData(`facturas.php?${params.toString()}`);
    };
    
    const cargarFacturaDetalleAPI = (id) => fetchData(`facturas.php?id=${id}`).then(r => r.data);
    const guardarProductoAPI = (p) => fetchData('productos.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) }).then(r => r.data);
    const guardarMovimientoAPI = (m) => fetchData('movimientos.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(m) }).then(r => r.data);
    const guardarFacturaAPI = (f) => fetchData('facturas.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    const guardarFacturaCompraAPI = (f) => fetchData('facturas_compra.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    const eliminarProductoAPI = (id) => fetchData(`productos.php?id=${id}`, { method: 'DELETE' });
    const eliminarMovimientoAPI = (id) => fetchData(`movimientos.php?id=${id}`, { method: 'DELETE' });
    const anularFacturaAPI = (id, motivo) => fetchData(`facturas.php?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ motivo_anulacion: motivo }) });
    const cargarClientesAPI = (soloActivos = false) => fetchData(`clientes.php${soloActivos ? '?activo=1' : ''}`).then(r => r.data);
    const guardarClienteAPI = (c) => fetchData('clientes.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) });
    const actualizarClienteAPI = (id, c) => fetchData(`clientes.php?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) });
    const toggleActivoClienteAPI = (id) => fetchData(`clientes.php?id=${id}`, { method: 'DELETE' });
    const cargarProveedoresAPI = (soloActivos = false) => fetchData(`proveedores.php${soloActivos ? '?activo=1' : ''}`).then(r => r.data);
    const guardarProveedorAPI = (p) => fetchData('proveedores.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
    const actualizarProveedorAPI = (id, p) => fetchData(`proveedores.php?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
    const toggleActivoProveedorAPI = (id) => fetchData(`proveedores.php?id=${id}`, { method: 'DELETE' });
    const cargarCXCAPI = (params = {}) => fetchData(`cxc.php${Object.keys(params).length > 0 ? '?' + new URLSearchParams(params).toString() : ''}`).then(r => r.data);
    const registrarPagoAPI = (pagoData) => fetchData('cxc.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pagoData) });
    const cargarHistorialPagosFacturaAPI = (facturaId) => fetchData(`cxc.php?historial_pagos_factura_id=${facturaId}`).then(r => r.data);

    // --- FUNCIONES DE RENDERIZADO ---

    const popularDatalistProductos = (productos) => {
        if (!datalistProductos) return;
        datalistProductos.innerHTML = '';
        if (productos && productos.length > 0) {
            productos.forEach(pr => {
                if (!pr || typeof pr.id === 'undefined') return;
                const cP = String(pr.codigo || 0).padStart(3, '0');
                const o = document.createElement('option');
                o.value = `[${cP}] ${pr.descripcion || '?'} (${pr.departamento || '?'}) - ${pr.medida || '?'}`;
                o.dataset.id = pr.id;
                const precioRef = (pr.ultimo_precio_compra !== null && typeof pr.ultimo_precio_compra !== 'undefined') ? pr.ultimo_precio_compra : '';
                o.dataset.precio = precioRef;
                o.dataset.medida = pr.medida || '';
                datalistProductos.appendChild(o);
            });
        }
    };

    const renderizarTablaInventario = (productos) => {
        if (!cuerpoTablaInventario) return;
        cuerpoTablaInventario.innerHTML = '';
        if (!productos || productos.length === 0) {
            cuerpoTablaInventario.innerHTML = `<tr><td colspan="9" class="text-center p-3 fst-italic text-muted">No hay productos que coincidan con los filtros aplicados.</td></tr>`;
            return;
        }
        productos.forEach(pr => {
            if (!pr || typeof pr.id === 'undefined') return;
            const cP = String(pr.codigo || 0).padStart(3, '0');
            const stockValue = (pr.stock_actual === null || typeof pr.stock_actual === 'undefined') ? 0 : Number(pr.stock_actual);
            const stock = formatNumber(stockValue, 2);
            const uPrecio = formatCurrency(pr.ultimo_precio_compra);
            let stockClass = '';
            if (stockValue < 0) stockClass = 'stock-negativo';
            else if (stockValue === 0) stockClass = 'stock-cero';
            const stockHtml = stockClass ? `<span class="${stockClass}">${stock}</span>` : stock;
            const totalEntradas = formatNumber(pr.total_entradas_periodo, 2) || '0.00';
            const totalSalidas = formatNumber(pr.total_salidas_periodo, 2) || '0.00';
            const f = document.createElement('tr');
            f.innerHTML = `
                <td>${cP}</td>
                <td>${pr.departamento || '?'}</td>
                <td>${pr.descripcion || '?'}</td>
                <td>${pr.medida || '?'}</td>
                <td class="num">${stockHtml}</td>
                <td class="num">${uPrecio}</td>
                <td class="num text-success">${totalEntradas}</td>
                <td class="num text-danger">${totalSalidas}</td>
                <td><button class="btn btn-danger btn-sm btn-eliminar-producto" data-id="${pr.id}" title="Eliminar Producto" ${currentUserRole !== 'Administrador' ? 'disabled' : ''}><i class="fas fa-trash-alt"></i></button></td>`;
            cuerpoTablaInventario.appendChild(f);
        });
    };

    const renderizarTablaHistorial = (movimientos) => {
        if (!cuerpoTablaHistorial) return;
        cuerpoTablaHistorial.innerHTML = '';
        if (!movimientos || movimientos.length === 0) {
            cuerpoTablaHistorial.innerHTML = `<tr><td colspan="8" class="text-center p-3 fst-italic text-muted">No hay movimientos que coincidan con los filtros aplicados.</td></tr>`;
            return;
        }
        movimientos.forEach(mv => {
            if (!mv || typeof mv.id === 'undefined') return;
            const cP = String(mv.producto_codigo || 0).padStart(3, '0');
            const dP = `[${cP}] ${mv.producto_descripcion || '?'}`;
            const medP = mv.producto_medida || '';
            let fF = 'Inv.';
            try {
                if (mv.fecha) {
                    const date = new Date(mv.fecha + 'T00:00:00Z');
                    fF = date.toLocaleDateString('es-ES', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
                }
            } catch (e) {}
            const tM = mv.tipo ? (mv.tipo.charAt(0).toUpperCase() + mv.tipo.slice(1)) : '?';
            const tipoClass = mv.tipo === 'entrada' ? 'text-success' : 'text-warning';
            const cM = formatNumber(mv.cantidad, 2);
            const pT = formatCurrency(mv.precio_unitario);
            let pcT = mv.tipo === 'entrada' && mv.proveedor ? mv.proveedor : (mv.tipo === 'salida' && mv.cliente ? mv.cliente : '-');
            const rF = mv.factura_id ? `<a href="#" class="link-ver-factura" data-id="${mv.factura_id}" title="Ver Factura ${mv.factura_id}">${mv.factura_id}</a>` : '-';
            const isFacturaMov = !!mv.factura_id;
            const disableDelete = isFacturaMov || currentUserRole !== 'Administrador';
            const deleteTitle = isFacturaMov ? `Elimine la factura (ID: ${mv.factura_id})` : (currentUserRole !== 'Administrador' ? 'Permiso denegado' : 'Eliminar Movimiento');
            const f = document.createElement('tr');
            f.innerHTML = `<td>${fF}</td><td>${dP}</td><td><span class="${tipoClass}">${tM}</span></td><td class="num">${cM} ${medP}</td><td class="num">${pT}</td><td>${pcT}</td><td>${rF}</td><td><button class="btn btn-danger btn-sm btn-eliminar-movimiento" data-id="${mv.id}" ${disableDelete ? 'disabled' : ''} title="${deleteTitle}"><i class="fas fa-trash-alt"></i></button></td>`;
            cuerpoTablaHistorial.appendChild(f);
        });
    };

    const renderizarTablaHistorialFacturas = (facturas) => {
        if (!cuerpoTablaHistorialFacturas) return;
        cuerpoTablaHistorialFacturas.innerHTML = '';
        if (!facturas || facturas.length === 0) {
            cuerpoTablaHistorialFacturas.innerHTML = `<tr><td colspan="8" class="text-center p-3 fst-italic text-muted">No hay facturas que coincidan con los filtros aplicados.</td></tr>`;
            return;
        }
        facturas.forEach(fa => {
            if (!fa || typeof fa.id === 'undefined') return;
            let fF = 'Inv.';
            try { if (fa.fecha) { const date = new Date(fa.fecha + 'T00:00:00Z'); fF = date.toLocaleDateString('es-ES', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' }); } } catch (e) {}
            const totalF = formatCurrency(fa.total);
            const clienteParaTabla = fa.cliente_nombre || (fa.cliente || '-');
            let condPagoDisplay = fa.condicion_pago ? (fa.condicion_pago.charAt(0).toUpperCase() + fa.condicion_pago.slice(1)) : '-';
            let saldoDisplay = (fa.condicion_pago === 'credito' && fa.saldo_pendiente !== null) ? formatCurrency(fa.saldo_pendiente) : '-';
            
            const esAnulada = fa.anulada;
            let estadoPagoDisplay = '';
            let accionesHtml = '';

            if (esAnulada) {
                estadoPagoDisplay = '<span class="badge bg-dark">Anulada</span>';
                accionesHtml = `<button class="btn btn-secondary btn-sm btn-ver-factura-anulada" data-id="${fa.id}" title="Ver Info Factura Anulada"><i class="fas fa-info-circle"></i> Info</button>`;
            } else {
                if (fa.condicion_pago === 'contado') {
                    estadoPagoDisplay = '<span class="badge bg-light text-dark">Contado</span>';
                } else if (fa.condicion_pago === 'credito') {
                    if (fa.estado_pago === 'pagada') estadoPagoDisplay = '<span class="badge bg-success">Pagada</span>';
                    else if (fa.estado_pago === 'parcialmente_pagada') estadoPagoDisplay = '<span class="badge bg-info text-dark">Parcial</span>';
                    else estadoPagoDisplay = `<span class="badge bg-warning text-dark">Pendiente</span>`;
                }
                accionesHtml = `<button class="btn btn-info btn-sm btn-ver-factura" data-id="${fa.id}" title="Ver/Imprimir Factura"><i class="fas fa-eye"></i> Ver</button>`;
                if (fa.condicion_pago === 'credito') {
                    accionesHtml += ` <button class="btn btn-outline-secondary btn-sm btn-ver-historial-pagos ms-1" data-factura-id="${fa.id}" data-cliente-nombre="${fa.cliente_nombre || ''}" data-total-factura="${fa.total}" data-saldo-pendiente="${fa.saldo_pendiente}" title="Ver Pagos"><i class="fas fa-list-alt"></i> Pagos</button>`;
                }
                accionesHtml += ` <button class="btn btn-warning btn-sm btn-anular-factura ms-1" data-id="${fa.id}" title="Anular Factura" ${currentUserRole !== 'Administrador' ? 'disabled' : ''}><i class="fas fa-ban"></i> Anular</button>`;
            }
            
            const fi = document.createElement('tr');
            if (esAnulada) fi.classList.add('factura-anulada');
            fi.innerHTML = `<td>${fa.id}</td><td>${fF}</td><td>${clienteParaTabla}</td><td class="num">${totalF}</td><td>${condPagoDisplay}</td><td class="num">${saldoDisplay}</td><td>${estadoPagoDisplay}</td><td>${accionesHtml}</td>`;
            cuerpoTablaHistorialFacturas.appendChild(fi);
        });
    };

    const renderizarResumen = async () => {
        if (!resumenCardsContainer || !statTotalProductosEl) return;
        if (resumenLoadingPlaceholder) resumenLoadingPlaceholder.style.display = 'none';
        if (resumenErrorPlaceholder) resumenErrorPlaceholder.style.display = 'none';
        if (resumenCardsContainer) resumenCardsContainer.style.display = 'flex';
        try {
            const [productosFullResponse, facturasFullResponse] = await Promise.all([
                fetchData('productos.php?todos=1'),
                fetchData('facturas.php')
            ]);
            const prodsData = (productosFullResponse?.data) || [];
            const factsData = (facturasFullResponse?.data) || [];
            const totalProductos = prodsData.length;
            const bajoStock = prodsData.filter(p => (Number(p.stock_actual) <= 0)).length;
            const valorTotal = prodsData.reduce((sum, p) => sum + ((Number(p.stock_actual) || 0) * (Number(p.ultimo_precio_compra) || 0)), 0);
            const totalFacturas = factsData.filter(f => !f.anulada).length;
            statTotalProductosEl.textContent = formatNumber(totalProductos);
            statBajoStockEl.textContent = formatNumber(bajoStock);
            statValorTotalEl.textContent = formatCurrency(valorTotal);
            statTotalFacturasEl.textContent = formatNumber(totalFacturas);
        } catch (error) {
            console.error("Error en renderizarResumen:", error);
            if (resumenCardsContainer) resumenCardsContainer.style.display = 'none';
            if (resumenErrorPlaceholder) {
                resumenErrorPlaceholder.style.display = 'block';
                resumenErrorPlaceholder.textContent = 'Error al calcular resumen.';
            }
        }
    };

    const popularDatalistClientesFactura = (clientes) => {
        if (!datalistFacturaClientes) return;
        datalistFacturaClientes.innerHTML = '';
        const clientesActivos = clientes.filter(c => c.activo);
        clientesActivos.forEach(cli => {
            if (!cli || typeof cli.id === 'undefined') return;
            const opt = document.createElement('option');
            opt.value = `[${cli.id}] ${cli.nombre_razon_social} ${cli.codigo_alfanumerico ? '(' + cli.codigo_alfanumerico + ')' : ''}`;
            opt.dataset.id = cli.id;
            opt.dataset.nombre = cli.nombre_razon_social;
            datalistFacturaClientes.appendChild(opt);
        });
    };

    const popularDatalistProveedoresFactura = (proveedores) => {
        if (!datalistFacturaProveedores) return;
        datalistFacturaProveedores.innerHTML = '';
        proveedores.forEach(prov => {
            if (!prov || typeof prov.id === 'undefined') return;
            const opt = document.createElement('option');
            opt.value = `[${prov.id}] ${prov.nombre_razon_social}`;
            opt.dataset.id = prov.id;
            opt.dataset.nombre = prov.nombre_razon_social;
            datalistFacturaProveedores.appendChild(opt);
        });
    };

    const renderizarTablaClientes = (clientes) => {
        listaClientesGlobal = clientes || [];
        if (!cuerpoTablaClientes) return;
        cuerpoTablaClientes.innerHTML = '';
        if (!clientes || clientes.length === 0) {
            cuerpoTablaClientes.innerHTML = `<tr><td colspan="8" class="text-center p-3 fst-italic text-muted">No hay clientes registrados.</td></tr>`;
            return;
        }
        clientes.forEach(cli => {
            if (!cli || typeof cli.id === 'undefined') return;
            const esAdmin = currentUserRole === 'Administrador';
            const fila = document.createElement('tr');
            fila.dataset.clienteId = cli.id;
            const estadoActivo = cli.activo ? '<span class="badge bg-success">Activo</span>' : '<span class="badge bg-secondary">Inactivo</span>';
            const deuda = parseFloat(cli.deuda_total_pendiente) || 0;
            const deudaDisplay = formatCurrency(deuda);
            const deudaClass = deuda > 0 ? 'deuda-pendiente' : 'sin-deuda';

            fila.innerHTML = `
                <td>${cli.id}</td>
                <td>${cli.nombre_razon_social || '?'}</td>
                <td>${cli.codigo_alfanumerico || '-'}</td>
                <td>${cli.identificacion_fiscal || '-'}</td>
                <td>${cli.telefono || '-'}</td>
                <td class="num ${deudaClass}">${deudaDisplay}</td>
                <td>${estadoActivo}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-editar-cliente" data-id="${cli.id}" title="Editar" ${!esAdmin ? 'disabled' : ''}><i class="fas fa-edit"></i></button>
                    <button class="btn btn-${cli.activo ? 'danger' : 'info'} btn-sm btn-toggle-activo-cliente ms-1" data-id="${cli.id}" title="${cli.activo ? 'Desactivar' : 'Activar'}" ${!esAdmin ? 'disabled' : ''}><i class="fas ${cli.activo ? 'fa-user-slash' : 'fa-user-check'}"></i></button>
                </td>`;
            cuerpoTablaClientes.appendChild(fila);
        });
    };

    const renderizarTablaProveedores = (proveedores) => {
        if (!cuerpoTablaProveedores) return;
        cuerpoTablaProveedores.innerHTML = '';
        if (!proveedores || proveedores.length === 0) {
            cuerpoTablaProveedores.innerHTML = `<tr><td colspan="7" class="text-center p-3 fst-italic text-muted">No hay proveedores registrados.</td></tr>`;
            return;
        }
        try {
            proveedores.forEach(prov => {
                if (!prov || typeof prov.id === 'undefined') {
                    console.warn("Proveedor inválido encontrado, saltando:", prov);
                    return; 
                }
                const esAdmin = currentUserRole === 'Administrador';
                const fila = document.createElement('tr');
                fila.dataset.proveedorId = prov.id;
                const estadoActivo = prov.activo ? '<span class="badge bg-success">Activo</span>' : '<span class="badge bg-secondary">Inactivo</span>';

                fila.innerHTML = `
                    <td>${prov.id}</td>
                    <td>${prov.nombre_razon_social || '?'}</td>
                    <td>${prov.codigo_proveedor_alfanumerico || '-'}</td>
                    <td>${prov.identificacion_fiscal || '-'}</td>
                    <td>${prov.telefono || '-'}</td>
                    <td>${estadoActivo}</td>
                    <td>
                        <button class="btn btn-warning btn-sm btn-editar-proveedor" data-id="${prov.id}" title="Editar" ${!esAdmin ? 'disabled' : ''}><i class="fas fa-edit"></i></button>
                        <button class="btn btn-${prov.activo ? 'danger' : 'info'} btn-sm btn-toggle-activo-proveedor ms-1" data-id="${prov.id}" title="${prov.activo ? 'Desactivar' : 'Activar'}" ${!esAdmin ? 'disabled' : ''}><i class="fas ${prov.activo ? 'fa-user-slash' : 'fa-user-check'}"></i></button>
                    </td>`;
                cuerpoTablaProveedores.appendChild(fila);
            });
        } catch (error) {
            console.error("Error al renderizar tabla de proveedores:", error);
            cuerpoTablaProveedores.innerHTML = `<tr><td colspan="7" class="text-center p-3 text-danger">Error al cargar proveedores: ${error.message}</td></tr>`;
        }
    };

    const popularFiltroClientesCXC = (clientes) => {
        if (!selectFiltroCXCCliente) return;
        selectFiltroCXCCliente.innerHTML = '<option value="">Todos</option>';
        const clientesActivos = clientes.filter(c => c.activo);
        clientesActivos.forEach(cli => {
            const opt = document.createElement('option');
            opt.value = cli.id;
            opt.textContent = `[${cli.id}] ${cli.nombre_razon_social} ${cli.codigo_alfanumerico ? '(' + cli.codigo_alfanumerico + ')' : ''}`;
            selectFiltroCXCCliente.appendChild(opt);
        });
    };

    const renderizarTablaCXC = (facturasPendientes) => {
        if (!cuerpoTablaCXC) return;
        cuerpoTablaCXC.innerHTML = '';
        if (!facturasPendientes || facturasPendientes.length === 0) {
            cuerpoTablaCXC.innerHTML = `<tr><td colspan="9" class="text-center p-3 fst-italic text-muted">No hay cuentas por cobrar con los filtros seleccionados.</td></tr>`;
            return;
        }
        facturasPendientes.forEach(f => {
            const fila = document.createElement('tr');
            let estadoBadge;
            if (f.estado_pago === 'pendiente') estadoBadge = '<span class="badge bg-warning text-dark">Pendiente</span>';
            else if (f.estado_pago === 'parcialmente_pagada') estadoBadge = '<span class="badge bg-info text-dark">Parcial</span>';
            else estadoBadge = '<span class="badge bg-success">Pagada</span>';
            
            let diasVencidosDisplay = (f.dias_vencidos > 0) ? `<span class="text-danger fw-bold">${f.dias_vencidos}</span>` : (f.dias_vencidos === 0 ? '0' : '-');
            if (f.estado_pago === 'pagada') diasVencidosDisplay = '-';

            const puedeRegistrarPago = currentUserRole === 'Administrador' || currentUserRole === 'Cajero';
            fila.innerHTML = `
                <td>${f.id}</td>
                <td>${f.cliente_nombre || 'N/A'}</td>
                <td>${new Date(f.fecha + 'T00:00:00Z').toLocaleDateString('es-ES',{timeZone:'UTC'})}</td>
                <td>${f.fecha_vencimiento ? new Date(f.fecha_vencimiento + 'T00:00:00Z').toLocaleDateString('es-ES',{timeZone:'UTC'}) : '-'}</td>
                <td class="num">${formatCurrency(f.total)}</td>
                <td class="num fw-bold">${formatCurrency(f.saldo_pendiente)}</td>
                <td>${estadoBadge}</td>
                <td class="num">${diasVencidosDisplay}</td>
                <td>
                    ${f.estado_pago !== 'pagada' ? `<button class="btn btn-success btn-sm btn-registrar-pago-cxc me-1" data-factura-id="${f.id}" data-cliente-nombre="${f.cliente_nombre || ''}" data-saldo-actual="${f.saldo_pendiente}" title="Registrar Pago" ${!puedeRegistrarPago ? 'disabled' : ''}><i class="fas fa-dollar-sign"></i> Pagar</button>` : ''}
                    <button class="btn btn-info btn-sm btn-ver-historial-pagos" data-factura-id="${f.id}" data-cliente-nombre="${f.cliente_nombre || ''}" data-total-factura="${f.total}" data-saldo-pendiente="${f.saldo_pendiente}" title="Ver Pagos"><i class="fas fa-list-alt"></i> Pagos</button>
                </td>`;
            cuerpoTablaCXC.appendChild(fila);
        });
    };

    const renderizarTablaHistorialPagos = (pagos) => {
        if (!cuerpoTablaHistorialPagos || !mensajeHistorialPagosModal) return;
        cuerpoTablaHistorialPagos.innerHTML = '';
        mensajeHistorialPagosModal.innerHTML = '';
        if (!pagos || pagos.length === 0) {
            cuerpoTablaHistorialPagos.innerHTML = `<tr><td colspan="7" class="text-center p-3 fst-italic text-muted">No hay pagos registrados para esta factura.</td></tr>`;
            return;
        }
        pagos.forEach(p => {
            const fila = document.createElement('tr');
            let fechaPagoFmt = 'N/A';
            if (p.fecha_pago) {
                try {
                    const dateObj = new Date(p.fecha_pago + 'T00:00:00Z');
                    if (!isNaN(dateObj)) fechaPagoFmt = dateObj.toLocaleDateString('es-ES', { timeZone: 'UTC' });
                } catch (e) {}
            }
            let fechaRegistroFmt = 'N/A';
            if (p.fecha_registro_pago) {
                try {
                    const dateObj = new Date(p.fecha_registro_pago.replace(' ', 'T'));
                    if (!isNaN(dateObj)) fechaRegistroFmt = dateObj.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
                } catch (e) {}
            }
            fila.innerHTML = `
                <td>${fechaPagoFmt}</td>
                <td class="num">${formatCurrency(p.monto_pagado)}</td>
                <td>${p.metodo_pago || '-'}</td>
                <td>${p.referencia_pago || '-'}</td>
                <td>${p.observaciones || '-'}</td>
                <td>${p.usuario_registro_nombre || 'Sistema'}</td>
                <td>${fechaRegistroFmt}</td>`;
            cuerpoTablaHistorialPagos.appendChild(fila);
        });
    };
    
    const renderizarControlesPaginacion = (tipo, currentPage, totalPages, totalRecords, limit, elements) => {
        const { btnPrimera, btnAnterior, pageDisplay, btnSiguiente, btnUltima, paginationInfo, limitSelect, paginationControls } = elements;
        if (!btnPrimera || !pageDisplay || !paginationInfo || !limitSelect || !paginationControls) return;
        
        limitSelect.value = limit;
        if (totalRecords <= 0) {
            pageDisplay.textContent = 'Pág. 0 de 0';
            paginationInfo.textContent = `0 registros.`;
            [btnPrimera, btnAnterior, btnSiguiente, btnUltima].forEach(btn => btn.parentElement.classList.add('disabled'));
            paginationControls.style.display = 'none';
            return;
        }
        paginationControls.style.display = 'flex';
        pageDisplay.textContent = `Pág. ${currentPage} de ${totalPages}`;
        const primerRegistro = (currentPage - 1) * limit + 1;
        const ultimoRegistro = Math.min(currentPage * limit, totalRecords);
        paginationInfo.textContent = `${totalRecords > 0 ? primerRegistro + '-' + ultimoRegistro : '0'} de ${totalRecords} registros.`;
        btnPrimera.parentElement.classList.toggle('disabled', currentPage <= 1);
        btnAnterior.parentElement.classList.toggle('disabled', currentPage <= 1);
        btnSiguiente.parentElement.classList.toggle('disabled', currentPage >= totalPages);
        btnUltima.parentElement.classList.toggle('disabled', currentPage >= totalPages);
    };

    // --- LÓGICA DE CARGA Y FILTRADO DE DATOS ---

    const cargarYRenderizarInventario = async () => {
        if (!cuerpoTablaInventario) return;
        cuerpoTablaInventario.innerHTML = `<tr><td colspan="9" class="text-center p-3"><div class="spinner-border spinner-border-sm"></div> Cargando inventario...</td></tr>`;
        if (inventarioPaginationControls) inventarioPaginationControls.style.display = 'none';
        try {
            const response = await cargarProductosAPI(inventarioCurrentPage, inventarioLimit, inventarioFiltrosActuales);
            if (response && response.success) {
                renderizarTablaInventario(response.data);
                inventarioCurrentPage = response.pagination.currentPage;
                inventarioLimit = response.pagination.limit;
                inventarioTotalRecords = response.pagination.totalRecords;
                inventarioTotalPages = response.pagination.totalPages;
                renderizarControlesPaginacion('inventario', inventarioCurrentPage, inventarioTotalPages, inventarioTotalRecords, inventarioLimit, { btnPrimera: inventarioBtnPrimera, btnAnterior: inventarioBtnAnterior, pageDisplay: inventarioPageDisplay, btnSiguiente: inventarioBtnSiguiente, btnUltima: inventarioBtnUltima, paginationInfo: inventarioPaginationInfo, limitSelect: inventarioLimitSelect, paginationControls: inventarioPaginationControls });
            }
        } catch (error) {
            mostrarMensaje(mensajeGlobalContainer, `Error obteniendo inventario: ${error.message}`, 'danger');
            cuerpoTablaInventario.innerHTML = `<tr><td colspan="9" class="text-center p-3 text-danger">Error al cargar inventario.</td></tr>`;
            renderizarControlesPaginacion('inventario', 0, 0, 0, inventarioLimit, { btnPrimera: inventarioBtnPrimera, btnAnterior: inventarioBtnAnterior, pageDisplay: inventarioPageDisplay, btnSiguiente: inventarioBtnSiguiente, btnUltima: inventarioBtnUltima, paginationInfo: inventarioPaginationInfo, limitSelect: inventarioLimitSelect, paginationControls: inventarioPaginationControls });
        }
    };

    const aplicarFiltrosInventario = () => {
        inventarioFiltrosActuales.texto = filtroInventarioTexto?.value || '';
        inventarioFiltrosActuales.stock = filtroInventarioStock?.value || '';
        inventarioFiltrosActuales.esFechaInicio = filtroInventarioESFechaInicio?.value || '';
        inventarioFiltrosActuales.esFechaFin = filtroInventarioESFechaFin?.value || '';
        inventarioCurrentPage = 1;
        cargarYRenderizarInventario();
    };

    const cargarYRenderizarHistorialMovimientos = async () => {
        if (!cuerpoTablaHistorial) return;
        cuerpoTablaHistorial.innerHTML = `<tr><td colspan="8" class="text-center p-3"><div class="spinner-border spinner-border-sm"></div> Cargando movimientos...</td></tr>`;
        if (historialMovimientosPaginationControls) historialMovimientosPaginationControls.style.display = 'none';
        try {
            const response = await cargarMovimientosAPI(historialMovimientosCurrentPage, historialMovimientosLimit, historialMovimientosFiltrosActuales);
            if (response && response.success) {
                renderizarTablaHistorial(response.data);
                historialMovimientosCurrentPage = response.pagination.currentPage;
                historialMovimientosLimit = response.pagination.limit;
                historialMovimientosTotalRecords = response.pagination.totalRecords;
                historialMovimientosTotalPages = response.pagination.totalPages;
                renderizarControlesPaginacion('historialMov', historialMovimientosCurrentPage, historialMovimientosTotalPages, historialMovimientosTotalRecords, historialMovimientosLimit, { btnPrimera: historialBtnPrimera, btnAnterior: historialBtnAnterior, pageDisplay: historialPageDisplay, btnSiguiente: historialBtnSiguiente, btnUltima: historialBtnUltima, paginationInfo: historialPaginationInfo, limitSelect: historialLimitSelect, paginationControls: historialMovimientosPaginationControls });
            }
        } catch (error) {
            mostrarMensaje(mensajeGlobalContainer, `Error obteniendo movimientos: ${error.message}`, 'danger');
            cuerpoTablaHistorial.innerHTML = `<tr><td colspan="8" class="text-center p-3 text-danger">Error al cargar movimientos.</td></tr>`;
            renderizarControlesPaginacion('historialMov', 0, 0, 0, historialMovimientosLimit, { btnPrimera: historialBtnPrimera, btnAnterior: historialBtnAnterior, pageDisplay: historialPageDisplay, btnSiguiente: historialBtnSiguiente, btnUltima: historialBtnUltima, paginationInfo: historialPaginationInfo, limitSelect: historialLimitSelect, paginationControls: historialMovimientosPaginationControls });
        }
    };

    const aplicarFiltrosHistorialMov = () => {
        historialMovimientosFiltrosActuales.texto = filtroHistorialTexto?.value || '';
        historialMovimientosFiltrosActuales.tipo = filtroHistorialTipo?.value || '';
        historialMovimientosFiltrosActuales.fechaInicio = filtroHistorialFechaInicio?.value || '';
        historialMovimientosFiltrosActuales.fechaFin = filtroHistorialFechaFin?.value || '';
        historialMovimientosCurrentPage = 1;
        cargarYRenderizarHistorialMovimientos();
    };

    const cargarYRenderizarHistorialFacturas = async () => {
        if (!cuerpoTablaHistorialFacturas) return;
        cuerpoTablaHistorialFacturas.innerHTML = `<tr><td colspan="8" class="text-center p-3"><div class="spinner-border spinner-border-sm"></div> Cargando facturas...</td></tr>`;
        if(histfactPaginationControls) histfactPaginationControls.style.display = 'none';
        try {
            const response = await cargarListaFacturasAPI(histFacturasCurrentPage, histFacturasLimit, histFacturasFiltrosActuales);
            if (response && response.success) {
                renderizarTablaHistorialFacturas(response.data);
                histFacturasCurrentPage = response.pagination.currentPage;
                histFacturasLimit = response.pagination.limit;
                histFacturasTotalRecords = response.pagination.totalRecords;
                histFacturasTotalPages = response.pagination.totalPages;
                renderizarControlesPaginacion('histFact', histFacturasCurrentPage, histFacturasTotalPages, histFacturasTotalRecords, histFacturasLimit, { btnPrimera: histfactBtnPrimera, btnAnterior: histfactBtnAnterior, pageDisplay: histfactPageDisplay, btnSiguiente: histfactBtnSiguiente, btnUltima: histfactBtnUltima, paginationInfo: histfactPaginationInfo, limitSelect: histfactLimitSelect, paginationControls: histfactPaginationControls });
            }
        } catch (error) {
            mostrarMensaje(mensajeGlobalContainer, `Error obteniendo historial de facturas: ${error.message}`, 'danger');
            if(cuerpoTablaHistorialFacturas) cuerpoTablaHistorialFacturas.innerHTML = `<tr><td colspan="8" class="text-center p-3 text-danger">Error al cargar facturas.</td></tr>`;
            renderizarControlesPaginacion('histFact',0,0,0,histFacturasLimit, { btnPrimera: histfactBtnPrimera, btnAnterior: histfactBtnAnterior, pageDisplay: histfactPageDisplay, btnSiguiente: histfactBtnSiguiente, btnUltima: histfactBtnUltima, paginationInfo: histfactPaginationInfo, limitSelect: histfactLimitSelect, paginationControls: histfactPaginationControls });
        }
    };
    
    const aplicarFiltrosHistorialFact = () => {
        histFacturasFiltrosActuales.texto = filtroFacturasTexto?.value || '';
        histFacturasFiltrosActuales.fechaInicio = filtroFacturasFechaInicio?.value || '';
        histFacturasFiltrosActuales.fechaFin = filtroFacturasFechaFin?.value || '';
        histFacturasFiltrosActuales.estado_pago = filtroFacturasEstadoPago?.value || '';
        histFacturasFiltrosActuales.ver_anuladas = filtroFacturasVerAnuladas?.checked || false;
        histFacturasCurrentPage = 1;
        cargarYRenderizarHistorialFacturas();
    };

    // --- LÓGICA DE NEGOCIO Y MANEJO DE EVENTOS ---

    const solicitarConfirmacionAccion = (tipo, id, msg, cb) => {
        if (!confirmDeleteModal || !confirmDeleteMessage || !confirmDeleteBtn) {
            if (confirm(msg)) {
                if (cb) cb();
            } else {
                mostrarMensaje(mensajeGlobalContainer, "Acción cancelada.", "info");
            }
            return;
        }
        confirmDeleteMessage.textContent = msg;
        deleteCallback = cb;
        const newBtn = confirmDeleteBtn.cloneNode(true);
        confirmDeleteBtn.parentNode.replaceChild(newBtn, confirmDeleteBtn);
        confirmDeleteBtn = newBtn;
        confirmDeleteBtn.onclick = () => {
            confirmDeleteModal.hide();
            if (deleteCallback) {
                deleteCallback();
                deleteCallback = null;
            }
        };
        confirmDeleteModal.show();
    };

    const agregarProducto = async (e) => {
        e.preventDefault();
        if (currentUserRole !== 'Administrador') { mostrarMensaje(mensajeProducto, 'No tiene permisos para esta acción.', 'warning'); return; }
        const producto = { departamento: inputDepto.value.trim(), descripcion: inputDesc.value.trim(), medida: selectMedida.value };
        if (!producto.departamento || !producto.descripcion || !producto.medida) { mostrarMensaje(mensajeProducto, 'Todos los campos son obligatorios.', 'warning'); return; }
        try {
            const nuevoProd = await guardarProductoAPI(producto);
            mostrarMensaje(mensajeProducto, `Producto [${String(nuevoProd.codigo || 0).padStart(3,'0')}] "${producto.descripcion}" guardado exitosamente.`, 'success');
            formNuevoProducto.reset();
            await inicializarAplicacion(currentUserRole, false);
        } catch (error) {
            mostrarMensaje(mensajeProducto, error.message || 'Error al guardar el producto.', 'danger');
        }
    };

    const eliminarProducto = (id) => {
        const productoParaEliminar = listaProductosGlobal.find(p => p.id === id);
        const desc = productoParaEliminar ? `"${productoParaEliminar.descripcion}" (Cód: ${String(productoParaEliminar.codigo || 0).padStart(3,'0')})` : `con ID ${id}`;
        solicitarConfirmacionAccion('Producto', id, `¿Está seguro de que desea ELIMINAR el producto ${desc}?\nEsta acción no se puede deshacer y fallará si el producto tiene movimientos o facturas asociadas.`, async () => {
            try {
                const result = await eliminarProductoAPI(id);
                mostrarMensaje(mensajeGlobalContainer, result.message || `Producto con ID ${id} eliminado.`, 'success');
                await inicializarAplicacion(currentUserRole, false);
            } catch (error) {
                mostrarMensaje(mensajeGlobalContainer, error.message || 'Error al eliminar el producto.', 'danger');
            }
        });
    };

    const actualizarCamposMovimiento = () => { // <-- CORREGIDO
        if (!selectAjusteTipo || !precioContainer || !inputAjustePrecio || !proveedorContainer || !inputAjusteProveedor || !clienteContainer || !inputAjusteCliente) return;
        const tipo = selectAjusteTipo.value;
        const esEntrada = tipo === 'entrada';
        precioContainer.style.display = esEntrada ? 'block' : 'none';
        inputAjustePrecio.required = esEntrada;
        proveedorContainer.style.display = esEntrada ? 'block' : 'none';
        clienteContainer.style.display = !esEntrada ? 'block' : 'none';
        if (!esEntrada) { inputAjustePrecio.value = ''; inputAjusteProveedor.value = ''; } else { inputAjusteCliente.value = ''; }
    };
    
    const agregarMovimiento = async (e) => { // <-- CORREGIDO
        e.preventDefault();
        const productoIdSeleccionado = hiddenAjusteProductoId.value;
        const cantidadValor = inputAjusteCantidad.value.replace(',', '.');
        const precioValor = inputAjustePrecio.value.replace(',', '.');
        const productoSeleccionado = listaProductosGlobal.find(p => p.id == productoIdSeleccionado);
        const descProd = productoSeleccionado ? `"${productoSeleccionado.descripcion}"` : 'seleccionado';
        
        if (!productoIdSeleccionado) { mostrarMensaje(mensajeAjuste, 'Debe seleccionar un producto válido de la lista.', 'warning'); inputAjusteProducto.focus(); return; }
        if (!selectAjusteTipo.value || !cantidadValor || isNaN(cantidadValor) || Number(cantidadValor) <= 0 || !inputAjusteFecha.value) { mostrarMensaje(mensajeAjuste, 'Complete los campos requeridos (Producto, Tipo, Cantidad > 0, Fecha).', 'warning'); return; }
        if (selectAjusteTipo.value === 'entrada' && (precioValor === '' || isNaN(precioValor) || Number(precioValor) < 0)) { mostrarMensaje(mensajeAjuste, 'El precio debe ser un número válido para las entradas.', 'warning'); inputAjustePrecio.focus(); return; }
        
        const movimiento = {
            productoId: parseInt(productoIdSeleccionado, 10),
            tipo: selectAjusteTipo.value,
            cantidad: parseFloat(cantidadValor),
            fecha: inputAjusteFecha.value,
            precio: selectAjusteTipo.value === 'entrada' ? parseFloat(precioValor) : null,
            proveedor: selectAjusteTipo.value === 'entrada' ? inputAjusteProveedor.value.trim() : null,
            cliente: selectAjusteTipo.value === 'salida' ? inputAjusteCliente.value.trim() : null,
        };

        try {
            await guardarMovimientoAPI(movimiento);
            mostrarMensaje(mensajeAjuste, `Movimiento (${movimiento.tipo}) de ${movimiento.cantidad} para el producto ${descProd} registrado exitosamente.`, 'success');
            formAjuste.reset();
            hiddenAjusteProductoId.value = '';
            inputAjusteProducto.value = '';
            if (inputAjusteFecha) inputAjusteFecha.valueAsDate = new Date();
            actualizarCamposMovimiento();
            await inicializarAplicacion(currentUserRole, false);
        } catch (error) {
            mostrarMensaje(mensajeAjuste, error.message || 'Error al guardar el movimiento.', 'danger');
        }
    };

    const eliminarMovimiento = (id) => {
        solicitarConfirmacionAccion('Movimiento MANUAL', id, `¿Está seguro de que desea ELIMINAR el movimiento manual con ID ${id}?\nEsta acción no se puede deshacer. No podrá eliminar movimientos generados por facturas.`, async () => {
            try {
                const result = await eliminarMovimientoAPI(id);
                mostrarMensaje(mensajeGlobalContainer, result.message || `Movimiento con ID ${id} eliminado.`, 'success');
                await inicializarAplicacion(currentUserRole, false);
            } catch (error) {
                mostrarMensaje(mensajeGlobalContainer, error.message || 'Error al eliminar el movimiento.', 'danger');
            }
        });
    };

    const calcularTotalFactura = () => {
        let total = 0;
        if (cuerpoTablaFacturaItems) {
            cuerpoTablaFacturaItems.querySelectorAll('tr').forEach(fila => {
                const subtotalEl = fila.querySelector('.subtotal');
                if (subtotalEl) total += parseFloat(subtotalEl.dataset.valor || 0);
            });
        }
        if (facturaTotalDisplay) facturaTotalDisplay.textContent = `Total Factura: ${formatCurrency(total)}`;
        return total;
    };

    const calcularTotalFacturaCompra = () => {
        let total = 0;
        if (cuerpoTablaFacturaCompraItems) {
            cuerpoTablaFacturaCompraItems.querySelectorAll('tr').forEach(fila => {
                const subtotalEl = fila.querySelector('.subtotal');
                if (subtotalEl) total += parseFloat(subtotalEl.dataset.valor || 0);
            });
        }
        if (facturaCompraTotalDisplay) facturaCompraTotalDisplay.textContent = `Total Factura Compra: ${formatCurrency(total)}`;
        return total;
    };

    const actualizarSubtotalFilaFactura = (fila) => {
        const cantInput = fila.querySelector('.factura-item-cantidad');
        const precioInput = fila.querySelector('.factura-item-precio');
        const subtotalTd = fila.querySelector('.subtotal');
        if (!cantInput || !precioInput || !subtotalTd) return;
        const cantidad = parseFloat(cantInput.value) || 0;
        const precio = parseFloat(precioInput.value) || 0;
        const subtotal = cantidad * precio;
        subtotalTd.textContent = formatNumber(subtotal, 2);
        subtotalTd.dataset.valor = subtotal;
        calcularTotalFactura();
    };

    const actualizarSubtotalFilaFacturaCompra = (fila) => {
        const cantInput = fila.querySelector('.factura-compra-item-cantidad');
        const costoInput = fila.querySelector('.factura-compra-item-costo');
        const subtotalTd = fila.querySelector('.subtotal');
        if (!cantInput || !costoInput || !subtotalTd) return;
        const cantidad = parseFloat(cantInput.value) || 0;
        const costo = parseFloat(costoInput.value) || 0;
        const subtotal = cantidad * costo;
        subtotalTd.textContent = formatNumber(subtotal, 2);
        subtotalTd.dataset.valor = subtotal;
        calcularTotalFacturaCompra();
    };

    const agregarFilaFactura = () => {
        if (!cuerpoTablaFacturaItems || !btnAddFacturaItem || !datalistProductos) return;
        if (cuerpoTablaFacturaItems.rows.length >= MAX_ITEMS_FACTURA) {
            mostrarMensaje(mensajeFactura, `Se ha alcanzado el máximo de ${MAX_ITEMS_FACTURA} ítems por factura.`, 'warning');
            return;
        }
        const newRow = cuerpoTablaFacturaItems.insertRow();
        newRow.innerHTML = `
            <td><input type="text" list="productos-lista" class="form-control form-control-sm factura-producto-input" placeholder="[Cod] Buscar producto..." required autocomplete="off"><input type="hidden" class="factura-producto-id"></td>
            <td><input type="number" class="form-control form-control-sm factura-item-cantidad num" min="0.01" step="any" required value="1"></td>
            <td><input type="number" class="form-control form-control-sm factura-item-precio num" min="0" step="0.01" required placeholder="0.00"></td>
            <td class="subtotal num" data-valor="0">0.00</td>
            <td class="text-center"><button type="button" class="btn btn-danger btn-sm btn-eliminar-fila-factura" title="Quitar"><i class="fas fa-times"></i></button></td>`;
        
        const productoInput = newRow.querySelector('.factura-producto-input');
        const productoIdHidden = newRow.querySelector('.factura-producto-id');
        const cantidadInput = newRow.querySelector('.factura-item-cantidad');
        const precioInput = newRow.querySelector('.factura-item-precio');

        const handleProductSelection = () => {
            productoIdHidden.value = '';
            precioInput.value = '';
            productoInput.title = '';
            const selectedOption = Array.from(datalistProductos.options).find(o => o.value === productoInput.value);
            if (selectedOption?.dataset.id) {
                productoIdHidden.value = selectedOption.dataset.id;
                if (selectedOption.dataset.precio) precioInput.value = parseFloat(selectedOption.dataset.precio).toFixed(2);
                productoInput.title = `Unidad: ${selectedOption.dataset.medida || 'N/A'}`;
            }
            actualizarSubtotalFilaFactura(newRow);
        };

        productoInput.addEventListener('input', handleProductSelection);
        cantidadInput.addEventListener('input', () => actualizarSubtotalFilaFactura(newRow));
        precioInput.addEventListener('input', () => actualizarSubtotalFilaFactura(newRow));
        newRow.querySelector('.btn-eliminar-fila-factura').addEventListener('click', () => { newRow.remove(); calcularTotalFactura(); });
        
        productoInput.focus();
        calcularTotalFactura();
    };

    const agregarFilaFacturaCompra = () => {
        if (!cuerpoTablaFacturaCompraItems || !btnAddFacturaCompraItem || !datalistProductos) return;
        if (cuerpoTablaFacturaCompraItems.rows.length >= MAX_ITEMS_FACTURA) {
            mostrarMensaje(mensajeFacturaCompra, `Se ha alcanzado el máximo de ${MAX_ITEMS_FACTURA} ítems por factura.`, 'warning');
            return;
        }
        const newRow = cuerpoTablaFacturaCompraItems.insertRow();
        newRow.innerHTML = `
            <td><input type="text" list="productos-lista" class="form-control form-control-sm factura-compra-producto-input" placeholder="[Cod] Buscar producto..." required autocomplete="off"><input type="hidden" class="factura-compra-producto-id"></td>
            <td><input type="number" class="form-control form-control-sm factura-compra-item-cantidad num" min="0.01" step="any" required value="1"></td>
            <td><input type="number" class="form-control form-control-sm factura-compra-item-costo num" min="0" step="0.01" required placeholder="0.00"></td>
            <td class="subtotal num" data-valor="0">0.00</td>
            <td class="text-center"><button type="button" class="btn btn-danger btn-sm btn-eliminar-fila-factura-compra" title="Quitar"><i class="fas fa-times"></i></button></td>`;
        
        const productoInput = newRow.querySelector('.factura-compra-producto-input');
        const productoIdHidden = newRow.querySelector('.factura-compra-producto-id');
        const cantidadInput = newRow.querySelector('.factura-compra-item-cantidad');
        const costoInput = newRow.querySelector('.factura-compra-item-costo');

        const handleProductSelection = () => {
            productoIdHidden.value = '';
            costoInput.value = '';
            productoInput.title = '';
            const selectedOption = Array.from(datalistProductos.options).find(o => o.value === productoInput.value);
            if (selectedOption?.dataset.id) {
                productoIdHidden.value = selectedOption.dataset.id;
                if (selectedOption.dataset.precio) costoInput.value = parseFloat(selectedOption.dataset.precio).toFixed(2);
                productoInput.title = `Unidad: ${selectedOption.dataset.medida || 'N/A'}`;
            }
            actualizarSubtotalFilaFacturaCompra(newRow);
        };

        productoInput.addEventListener('input', handleProductSelection);
        cantidadInput.addEventListener('input', () => actualizarSubtotalFilaFacturaCompra(newRow));
        costoInput.addEventListener('input', () => actualizarSubtotalFilaFacturaCompra(newRow));
        newRow.querySelector('.btn-eliminar-fila-factura-compra').addEventListener('click', () => { newRow.remove(); calcularTotalFacturaCompra(); });
        
        productoInput.focus();
        calcularTotalFacturaCompra();
    };

    const guardarFactura = async () => {
        if (!facturaFecha || !hiddenFacturaClienteId || !cuerpoTablaFacturaItems || !btnGuardarFactura) return;
        
        const clienteIdSeleccionado = hiddenFacturaClienteId.value;
        if (!facturaFecha.value) { mostrarMensaje(mensajeFactura, "La fecha de la factura es requerida.", "warning"); facturaFecha.focus(); return; }
        if (!clienteIdSeleccionado) { mostrarMensaje(mensajeFactura, "Debe seleccionar un cliente válido de la lista.", "warning"); inputFacturaCliente.focus(); return; }

        const condicionPago = selectFacturaCondicionPago.value;
        let fechaVencimiento = null;
        if (condicionPago === 'credito') {
            if (!inputFacturaFechaVencimiento.value) { mostrarMensaje(mensajeFactura, "La fecha de vencimiento es requerida para facturas a crédito.", "warning"); inputFacturaFechaVencimiento.focus(); return; }
            if (new Date(inputFacturaFechaVencimiento.value) < new Date(facturaFecha.value)) { mostrarMensaje(mensajeFactura, "La fecha de vencimiento no puede ser anterior a la fecha de la factura.", "warning"); inputFacturaFechaVencimiento.focus(); return; }
            fechaVencimiento = inputFacturaFechaVencimiento.value;
        }

        const factura = { fecha: facturaFecha.value, clienteId: parseInt(clienteIdSeleccionado, 10), condicion_pago: condicionPago, fecha_vencimiento: fechaVencimiento, items: [] };
        
        const filasItems = cuerpoTablaFacturaItems.querySelectorAll('tr');
        if (filasItems.length === 0) { mostrarMensaje(mensajeFactura, "La factura debe tener al menos un ítem.", "warning"); return; }

        let itemsValidos = true;
        let primerElementoInvalido = null;

        filasItems.forEach(fila => {
            const productoInput = fila.querySelector('.factura-producto-input');
            const productoId = fila.querySelector('.factura-producto-id').value;
            const cantidad = fila.querySelector('.factura-item-cantidad').value;
            const precio = fila.querySelector('.factura-item-precio').value;

            [productoInput, fila.querySelector('.factura-item-cantidad'), fila.querySelector('.factura-item-precio')].forEach(el => el.classList.remove('is-invalid'));
            let errorEnFila = false;
            
            if (!productoId) { productoInput.classList.add('is-invalid'); if (!primerElementoInvalido) primerElementoInvalido = productoInput; errorEnFila = true; }
            if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) { fila.querySelector('.factura-item-cantidad').classList.add('is-invalid'); if (!primerElementoInvalido) primerElementoInvalido = fila.querySelector('.factura-item-cantidad'); errorEnFila = true; }
            if (precio === '' || isNaN(precio) || Number(precio) < 0) { fila.querySelector('.factura-item-precio').classList.add('is-invalid'); if (!primerElementoInvalido) primerElementoInvalido = fila.querySelector('.factura-item-precio'); errorEnFila = true; }
            
            if (!errorEnFila) factura.items.push({ productoId: parseInt(productoId, 10), cantidad: parseFloat(cantidad), precio: parseFloat(precio) });
            else itemsValidos = false;
        });

        if (!itemsValidos) {
            mostrarMensaje(mensajeFactura, "Revise los ítems marcados en rojo. Todos los campos son requeridos.", "warning", 6000);
            if (primerElementoInvalido) primerElementoInvalido.focus();
            return;
        }

        btnGuardarFactura.disabled = true;
        btnGuardarFactura.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Guardando...`;
        try {
            const result = await guardarFacturaAPI(factura);
            mostrarMensaje(mensajeFactura, result.message || `Factura ID ${result.data.id || '?'} guardada exitosamente.`, 'success');
            if (inputFacturaCliente) inputFacturaCliente.value = "";
            if (hiddenFacturaClienteId) hiddenFacturaClienteId.value = "";
            if(selectFacturaCondicionPago) { selectFacturaCondicionPago.value = "contado"; if (facturaFechaVencimientoContainer) facturaFechaVencimientoContainer.style.display = 'none'; if(inputFacturaFechaVencimiento) inputFacturaFechaVencimiento.value = ''; }
            if (facturaFecha) facturaFecha.valueAsDate = new Date();
            if (cuerpoTablaFacturaItems) cuerpoTablaFacturaItems.innerHTML = '';
            calcularTotalFactura();
            agregarFilaFactura();
            await inicializarAplicacion(currentUserRole, false);
        } catch (error) {
            mostrarMensaje(mensajeFactura, error.message || 'Error al guardar la factura.', 'danger');
        } finally {
            btnGuardarFactura.disabled = false;
            btnGuardarFactura.innerHTML = '<i class="fas fa-save"></i> Guardar Factura';
        }
    };

    const guardarFacturaCompra = async () => {
        if (!facturaCompraFecha || !hiddenFacturaCompraProveedorId || !cuerpoTablaFacturaCompraItems || !btnGuardarFacturaCompra) return;
        
        const proveedorIdSeleccionado = hiddenFacturaCompraProveedorId.value;
        if (!facturaCompraFecha.value) { mostrarMensaje(mensajeFacturaCompra, "La fecha de la factura es requerida.", "warning"); facturaCompraFecha.focus(); return; }
        if (!proveedorIdSeleccionado) { mostrarMensaje(mensajeFacturaCompra, "Debe seleccionar un proveedor válido de la lista.", "warning"); inputFacturaCompraProveedor.focus(); return; }

        const factura = { fecha: facturaCompraFecha.value, proveedorId: parseInt(proveedorIdSeleccionado, 10), items: [] };
        
        const filasItems = cuerpoTablaFacturaCompraItems.querySelectorAll('tr');
        if (filasItems.length === 0) { mostrarMensaje(mensajeFacturaCompra, "La factura debe tener al menos un ítem.", "warning"); return; }

        let itemsValidos = true;
        let primerElementoInvalido = null;

        filasItems.forEach(fila => {
            const productoInput = fila.querySelector('.factura-compra-producto-input');
            const productoId = fila.querySelector('.factura-compra-producto-id').value;
            const cantidad = fila.querySelector('.factura-compra-item-cantidad').value;
            const costo = fila.querySelector('.factura-compra-item-costo').value;

            [productoInput, fila.querySelector('.factura-compra-item-cantidad'), fila.querySelector('.factura-compra-item-costo')].forEach(el => el.classList.remove('is-invalid'));
            let errorEnFila = false;
            
            if (!productoId) { productoInput.classList.add('is-invalid'); if (!primerElementoInvalido) primerElementoInvalido = productoInput; errorEnFila = true; }
            if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) { fila.querySelector('.factura-compra-item-cantidad').classList.add('is-invalid'); if (!primerElementoInvalido) primerElementoInvalido = fila.querySelector('.factura-compra-item-cantidad'); errorEnFila = true; }
            if (costo === '' || isNaN(costo) || Number(costo) < 0) { fila.querySelector('.factura-compra-item-costo').classList.add('is-invalid'); if (!primerElementoInvalido) primerElementoInvalido = fila.querySelector('.factura-compra-item-costo'); errorEnFila = true; }
            
            if (!errorEnFila) factura.items.push({ productoId: parseInt(productoId, 10), cantidad: parseFloat(cantidad), costo: parseFloat(costo) });
            else itemsValidos = false;
        });

        if (!itemsValidos) {
            mostrarMensaje(mensajeFacturaCompra, "Revise los ítems marcados en rojo. Todos los campos son requeridos.", "warning", 6000);
            if (primerElementoInvalido) primerElementoInvalido.focus();
            return;
        }

        btnGuardarFacturaCompra.disabled = true;
        btnGuardarFacturaCompra.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Guardando...`;
        try {
            const result = await guardarFacturaCompraAPI(factura);
            mostrarMensaje(mensajeFacturaCompra, result.message || `Factura de Compra ID ${result.data.id || '?'} guardada exitosamente.`, 'success');
            if (inputFacturaCompraProveedor) inputFacturaCompraProveedor.value = "";
            if (hiddenFacturaCompraProveedorId) hiddenFacturaCompraProveedorId.value = "";
            if (facturaCompraFecha) facturaCompraFecha.valueAsDate = new Date();
            if (cuerpoTablaFacturaCompraItems) cuerpoTablaFacturaCompraItems.innerHTML = '';
            calcularTotalFacturaCompra();
            agregarFilaFacturaCompra();
            await inicializarAplicacion(currentUserRole, false);
        } catch (error) {
            mostrarMensaje(mensajeFacturaCompra, error.message || 'Error al guardar la factura de compra.', 'danger');
        } finally {
            btnGuardarFacturaCompra.disabled = false;
            btnGuardarFacturaCompra.innerHTML = '<i class="fas fa-save"></i> Guardar Factura de Compra';
        }
    };
    
    // MODIFICADO: para incluir hora y dirección
    const verFactura = async (facturaId) => {
        if (!printableArea) return;
        mostrarMensaje(mensajeGlobalContainer, `Cargando datos de la factura ${facturaId}...`, 'info', 2000);
        try {
            const fact = await cargarFacturaDetalleAPI(facturaId);
            let itemsHtml = fact.items.map(it => {
                const cP = String(it.producto_codigo || 0).padStart(3, '0');
                return `<tr><td>[${cP}] ${it.producto_descripcion || '?'}</td><td class="num">${formatNumber(it.cantidad, 2)} ${it.producto_medida || ''}</td><td class="num">${formatCurrency(it.precio_venta)}</td><td class="num">${formatCurrency(it.subtotal)}</td></tr>`;
            }).join('');
            
            if (!itemsHtml) itemsHtml = '<tr><td colspan="4" class="text-center">No hay ítems en esta factura.</td></tr>';
            
            let fechaCompletaFmt = fact.fecha_registro ? new Date(fact.fecha_registro.replace(' ', 'T')).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : (fact.fecha ? new Date(fact.fecha + 'T00:00:00Z').toLocaleDateString('es-ES',{timeZone:'UTC'}) : 'Inv.');
            let direccionCliente = fact.cliente_direccion || 'No especificada';

            let condicionHtml = `<p><strong>Condición:</strong> Contado</p>`;
            if (fact.condicion_pago === 'credito' && fact.fecha_vencimiento) {
                const fechaVencFmt = new Date(fact.fecha_vencimiento + 'T00:00:00Z').toLocaleDateString('es-ES', { timeZone: 'UTC' });
                condicionHtml = `<p><strong>Condición:</strong> Crédito | <strong>Vence:</strong> ${fechaVencFmt}</p>`;
            }

            let anuladaHtml = '';
            printableArea.classList.toggle('anulada-print-version', fact.anulada);
            if(fact.anulada) {
                anuladaHtml = `
                    <p class="text-danger fw-bold">FACTURA ANULADA</p>
                    <p><strong>Fecha Anulación:</strong> ${fact.fecha_anulacion ? new Date(fact.fecha_anulacion).toLocaleString('es-ES') : 'N/A'}</p>
                    <p><strong>Motivo:</strong> ${fact.motivo_anulacion || 'N/A'}</p>
                    <p><strong>Anulada por:</strong> ${fact.usuario_anulacion_nombre || 'N/A'}</p>`;
            }

            printableArea.innerHTML = `
                <div style="max-width: 800px; margin: auto;">
                    <h2>Factura N°: ${fact.id}</h2>
                    <p><strong>Fecha y Hora:</strong> ${fechaCompletaFmt}</p>
                    <p><strong>Cliente:</strong> ${fact.cliente_nombre || '-'}</p>
                    <p><strong>Dirección:</strong> ${direccionCliente}</p>
                    ${condicionHtml}
                    ${anuladaHtml}
                    <hr style="border-top: 1px solid #ccc; margin: 15px 0;">
                    <h3>Detalle de la Factura</h3>
                    <table><thead><tr><th>Producto</th><th class="num">Cantidad</th><th class="num">Precio U.</th><th class="num">Subtotal</th></tr></thead><tbody>${itemsHtml}</tbody></table>
                    <div id="print-total">Total General: ${formatCurrency(fact.total)}</div>
                    ${(fact.condicion_pago === 'credito' && !fact.anulada) ? `<p style="text-align:right;font-size:10pt;">Saldo Pendiente: ${formatCurrency(fact.saldo_pendiente)}</p>` : ''}
                    <p style="text-align:center;margin-top:40px;font-size:9pt;color:#777;" class="no-print">--- Documento No Fiscal ---</p>
                </div>`;
            
            printableArea.style.display = 'block';
            setTimeout(() => {
                try { window.print(); } catch (err) { mostrarMensaje(mensajeGlobalContainer, "Error al intentar imprimir.", "danger"); } 
                finally { setTimeout(() => { printableArea.style.display = 'none'; printableArea.innerHTML = ''; }, 500); }
            }, 300);
        } catch (error) {
            mostrarMensaje(mensajeGlobalContainer, error.message || `Error al cargar la factura ${facturaId}.`, 'danger');
            printableArea.style.display = 'none'; printableArea.innerHTML = '';
        }
    };

    const abrirModalAnulacion = (facturaId) => {
        if (!motivoAnulacionModal || !displayAnularFacturaId || !inputAnularFacturaId || !textareaMotivoAnulacion) return;
        displayAnularFacturaId.textContent = facturaId;
        inputAnularFacturaId.value = facturaId;
        textareaMotivoAnulacion.value = '';
        mensajeMotivoAnulacionModal.innerHTML = '';
        motivoAnulacionModal.show();
        textareaMotivoAnulacion.focus();
    };

    const confirmarAnulacionFactura = async () => {
        if (!inputAnularFacturaId || !textareaMotivoAnulacion) return;
        const facturaId = inputAnularFacturaId.value;
        const motivo = textareaMotivoAnulacion.value.trim();
        if (!motivo) { mostrarMensaje(mensajeMotivoAnulacionModal, 'El motivo de la anulación es obligatorio.', 'warning'); textareaMotivoAnulacion.focus(); return; }
        
        if (btnConfirmarAnulacion) { btnConfirmarAnulacion.disabled = true; btnConfirmarAnulacion.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Anulando...`; }
        try {
            const result = await anularFacturaAPI(facturaId, motivo);
            mostrarMensaje(mensajeGlobalContainer, result.message || `Factura ID ${facturaId} anulada exitosamente.`, 'success');
            motivoAnulacionModal.hide();
            await inicializarAplicacion(currentUserRole, false);
        } catch (error) {
            mostrarMensaje(mensajeMotivoAnulacionModal, error.message || 'Error al anular la factura.', 'danger');
        } finally {
            if (btnConfirmarAnulacion) { btnConfirmarAnulacion.disabled = false; btnConfirmarAnulacion.innerHTML = '<i class="fas fa-check"></i> Confirmar Anulación'; }
        }
    };

    const limpiarFormularioCliente = () => {
        if (!formCliente) return;
        formCliente.reset();
        if (inputClienteIdEdit) inputClienteIdEdit.value = '';
        if (clienteFormTitle) clienteFormTitle.textContent = 'Agregar Nuevo Cliente';
        if (btnCancelarClienteEdicion) btnCancelarClienteEdicion.style.display = 'none';
        if (inputClienteActivo) inputClienteActivo.checked = true;
        if (mensajeCliente) mensajeCliente.innerHTML = '';
    };

    const cargarDatosClienteEnFormulario = (clienteId) => {
        const cliente = listaClientesGlobal.find(c => c.id === clienteId);
        if (cliente && formCliente) {
            if (inputClienteIdEdit) inputClienteIdEdit.value = cliente.id;
            if (inputClienteNombre) inputClienteNombre.value = cliente.nombre_razon_social;
            if (inputClienteCodigoAlfanumerico) inputClienteCodigoAlfanumerico.value = cliente.codigo_alfanumerico || '';
            if (inputClienteIdentificacion) inputClienteIdentificacion.value = cliente.identificacion_fiscal || '';
            if (inputClienteTelefono) inputClienteTelefono.value = cliente.telefono || '';
            if (inputClienteDireccion) inputClienteDireccion.value = cliente.direccion || '';
            if (inputClienteEmail) inputClienteEmail.value = cliente.email || '';
            if (inputClienteActivo) inputClienteActivo.checked = cliente.activo;
            if (clienteFormTitle) clienteFormTitle.textContent = 'Editar Cliente (ID: ' + cliente.id + ')';
            if (btnCancelarClienteEdicion) btnCancelarClienteEdicion.style.display = 'inline-block';
            if (inputClienteNombre) inputClienteNombre.focus();
            formCliente.closest('.card')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            mostrarMensaje(mensajeCliente, 'Cliente no encontrado.', 'warning');
        }
    };

    const guardarOActualizarCliente = async (e) => {
        e.preventDefault();
        if (currentUserRole !== 'Administrador') { mostrarMensaje(mensajeCliente, 'No tiene permisos para esta acción.', 'warning'); return; }
        
        const nombre = inputClienteNombre.value.trim();
        if (!nombre) { mostrarMensaje(mensajeCliente, 'El nombre o razón social es obligatorio.', 'warning'); inputClienteNombre.focus(); return; }

        const clienteData = {
            nombre_razon_social: nombre,
            codigo_cliente_alfanumerico: inputClienteCodigoAlfanumerico.value.trim() || null,
            identificacion_fiscal: inputClienteIdentificacion.value.trim() || null,
            telefono: inputClienteTelefono.value.trim() || null,
            direccion: inputClienteDireccion.value.trim() || null,
            email: inputClienteEmail.value.trim() || null,
            activo: inputClienteActivo.checked
        };
        const clienteId = inputClienteIdEdit.value;

        try {
            const result = clienteId ? await actualizarClienteAPI(parseInt(clienteId), clienteData) : await guardarClienteAPI(clienteData);
            mostrarMensaje(mensajeCliente, result.message || 'Cliente procesado exitosamente.', 'success');
            limpiarFormularioCliente();
            await inicializarAplicacion(currentUserRole, false);
        } catch (error) {
            mostrarMensaje(mensajeCliente, error.message || 'Error al procesar el cliente.', 'danger');
        }
    };

    const toggleActivoCliente = (clienteId) => {
        if (currentUserRole !== 'Administrador') { mostrarMensaje(mensajeGlobalContainer, 'No tiene permisos para esta acción.', 'warning'); return; }
        const cliente = listaClientesGlobal.find(c => c.id === clienteId);
        if (!cliente) { mostrarMensaje(mensajeGlobalContainer, 'Cliente no encontrado.', 'danger'); return; }
        
        const accion = cliente.activo ? 'desactivar' : 'activar';
        solicitarConfirmacionAccion('ClienteToggleActivo', clienteId, `¿Está seguro de que desea ${accion} al cliente "${cliente.nombre_razon_social}" (ID: ${cliente.id})?`, async () => {
            try {
                const result = await toggleActivoClienteAPI(clienteId);
                mostrarMensaje(mensajeGlobalContainer, result.message || `Cliente ${accion}do exitosamente.`, 'success');
                inicializarAplicacion(currentUserRole, false);
            } catch (error) {
                mostrarMensaje(mensajeGlobalContainer, error.message || `Error al ${accion} el cliente.`, 'danger');
            }
        });
    };

    const limpiarFormularioProveedor = () => {
        if (!formProveedor) return;
        formProveedor.reset();
        if (inputProveedorIdEdit) inputProveedorIdEdit.value = '';
        if (proveedorFormTitle) proveedorFormTitle.textContent = 'Agregar Nuevo Proveedor';
        if (btnCancelarProveedorEdicion) btnCancelarProveedorEdicion.style.display = 'none';
        if (inputProveedorActivo) inputProveedorActivo.checked = true;
        if (mensajeProveedor) mensajeProveedor.innerHTML = '';
    };

    const cargarDatosProveedorEnFormulario = (proveedorId) => {
        const proveedor = listaProveedoresGlobal.find(p => p.id === proveedorId);
        if (proveedor && formProveedor) {
            if (inputProveedorIdEdit) inputProveedorIdEdit.value = proveedor.id;
            if (inputProveedorNombre) inputProveedorNombre.value = proveedor.nombre_razon_social;
            if (inputProveedorCodigoAlfanumerico) inputProveedorCodigoAlfanumerico.value = proveedor.codigo_proveedor_alfanumerico || '';
            if (inputProveedorIdentificacion) inputProveedorIdentificacion.value = proveedor.identificacion_fiscal || '';
            if (inputProveedorTelefono) inputProveedorTelefono.value = proveedor.telefono || '';
            if (inputProveedorDireccion) inputProveedorDireccion.value = proveedor.direccion || '';
            if (inputProveedorEmail) inputProveedorEmail.value = proveedor.email || '';
            if (inputProveedorActivo) inputProveedorActivo.checked = proveedor.activo;
            if (proveedorFormTitle) proveedorFormTitle.textContent = 'Editar Proveedor (ID: ' + proveedor.id + ')';
            if (btnCancelarProveedorEdicion) btnCancelarProveedorEdicion.style.display = 'inline-block';
            if (inputProveedorNombre) inputProveedorNombre.focus();
            formProveedor.closest('.card')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            mostrarMensaje(mensajeProveedor, 'Proveedor no encontrado.', 'warning');
        }
    };

    const guardarOActualizarProveedor = async (e) => {
        e.preventDefault();
        if (currentUserRole !== 'Administrador') { mostrarMensaje(mensajeProveedor, 'No tiene permisos para esta acción.', 'warning'); return; }
        
        const nombre = inputProveedorNombre.value.trim();
        if (!nombre) { mostrarMensaje(mensajeProveedor, 'El nombre o razón social es obligatorio.', 'warning'); inputProveedorNombre.focus(); return; }

        const proveedorData = {
            nombre_razon_social: nombre,
            codigo_proveedor_alfanumerico: inputProveedorCodigoAlfanumerico.value.trim() || null,
            identificacion_fiscal: inputProveedorIdentificacion.value.trim() || null,
            telefono: inputProveedorTelefono.value.trim() || null,
            direccion: inputProveedorDireccion.value.trim() || null,
            email: inputProveedorEmail.value.trim() || null,
            activo: inputProveedorActivo.checked
        };
        const proveedorId = inputProveedorIdEdit.value;

        try {
            const result = proveedorId ? await actualizarProveedorAPI(parseInt(proveedorId), proveedorData) : await guardarProveedorAPI(proveedorData);
            mostrarMensaje(mensajeProveedor, result.message || 'Proveedor procesado exitosamente.', 'success');
            limpiarFormularioProveedor();
            await inicializarAplicacion(currentUserRole, false);
        } catch (error) {
            mostrarMensaje(mensajeProveedor, error.message || 'Error al procesar el proveedor.', 'danger');
        }
    };

    const toggleActivoProveedor = (proveedorId) => {
        if (currentUserRole !== 'Administrador') { mostrarMensaje(mensajeGlobalContainer, 'No tiene permisos para esta acción.', 'warning'); return; }
        const proveedor = listaProveedoresGlobal.find(p => p.id === proveedorId);
        if (!proveedor) { mostrarMensaje(mensajeGlobalContainer, 'Proveedor no encontrado.', 'danger'); return; }
        
        const accion = proveedor.activo ? 'desactivar' : 'activar';
        solicitarConfirmacionAccion('ProveedorToggleActivo', proveedorId, `¿Está seguro de que desea ${accion} al proveedor "${proveedor.nombre_razon_social}" (ID: ${proveedor.id})?`, async () => {
            try {
                const result = await toggleActivoProveedorAPI(proveedorId);
                mostrarMensaje(mensajeGlobalContainer, result.message || `Proveedor ${accion}do exitosamente.`, 'success');
                inicializarAplicacion(currentUserRole, false);
            } catch (error) {
                mostrarMensaje(mensajeGlobalContainer, error.message || `Error al ${accion} el proveedor.`, 'danger');
            }
        });
    };
    
    const cargarYRenderizarCXC = async () => {
        if (!selectFiltroCXCCliente || !cuerpoTablaCXC) return;
        const params = {};
        if (selectFiltroCXCCliente.value) params.cliente_id = selectFiltroCXCCliente.value;
        if (inputFiltroCXCFacturaId.value) params.factura_id_en_cxc_lista = inputFiltroCXCFacturaId.value;
        if (selectFiltroCXCEstado.value === 'vencida') params.estado_vencimiento = 'vencida';
        else if (selectFiltroCXCEstado.value) params.estado_pago_filtro = selectFiltroCXCEstado.value;
        
        cuerpoTablaCXC.innerHTML = `<tr><td colspan="9" class="text-center p-3"><div class="spinner-border spinner-border-sm"></div> Cargando cuentas por cobrar...</td></tr>`;
        try {
            const facturasPendientes = await cargarCXCAPI(params);
            renderizarTablaCXC(facturasPendientes);
        } catch (error) {
            mostrarMensaje(mensajeGlobalContainer, 'Error al cargar las Cuentas por Cobrar.', 'danger');
            cuerpoTablaCXC.innerHTML = `<tr><td colspan="9" class="text-center p-3 text-danger fw-bold">Error al cargar los datos.</td></tr>`;
        }
    };

    const abrirModalPago = (facturaId, clienteNombre, saldoActual) => {
        if (!formRegistrarPago || !inputPagoFacturaId || !registrarPagoModal) return;
        formRegistrarPago.reset();
        inputPagoFacturaId.value = facturaId;
        displayPagoModalFacturaId.textContent = facturaId;
        displayPagoModalClienteNombre.textContent = clienteNombre || 'N/A';
        displayPagoModalSaldoActual.textContent = formatCurrency(saldoActual);
        inputPagoMonto.max = saldoActual;
        inputPagoMonto.value = saldoActual > 0 ? saldoActual.toFixed(2) : '';
        inputPagoFecha.valueAsDate = new Date();
        mensajePagoModal.innerHTML = '';
        registrarPagoModal.show();
    };

    const confirmarRegistroPago = async () => {
        if (!formRegistrarPago || !inputPagoFacturaId || !inputPagoMonto || !inputPagoFecha) return;
        const facturaId = inputPagoFacturaId.value;
        const monto = parseFloat(inputPagoMonto.value);
        const fecha = inputPagoFecha.value;
        const saldoActualNum = parseFloat(displayPagoModalSaldoActual.textContent.replace(/[^\d.-]/g, '')) || 0;
        
        if (isNaN(monto) || monto <= 0) { mostrarMensaje(mensajePagoModal, 'El monto a pagar debe ser mayor a cero.', 'warning'); inputPagoMonto.focus(); return; }
        if (!fecha) { mostrarMensaje(mensajePagoModal, 'La fecha de pago es requerida.', 'warning'); inputPagoFecha.focus(); return; }
        if (monto > saldoActualNum) { mostrarMensaje(mensajePagoModal, `El monto pagado (${formatCurrency(monto)}) no puede exceder el saldo pendiente (${formatCurrency(saldoActualNum)}).`, 'warning'); inputPagoMonto.focus(); return; }
        
        const pagoData = {
            factura_id: parseInt(facturaId),
            monto_pagado: monto,
            fecha_pago: fecha,
            metodo_pago: selectPagoMetodo?.value || null,
            referencia_pago: inputPagoReferencia?.value.trim() || null,
            observaciones: textareaPagoObservaciones?.value.trim() || null,
        };
        try {
            const result = await registrarPagoAPI(pagoData);
            mostrarMensaje(mensajeGlobalContainer, result.message || 'Pago registrado exitosamente.', 'success');
            registrarPagoModal.hide();
            await cargarYRenderizarCXC();
            await cargarYRenderizarHistorialFacturas();
        } catch (error) {
            mostrarMensaje(mensajePagoModal, error.message || 'Error al registrar el pago.', 'danger');
        }
    };
    
    const abrirModalHistorialPagos = async (facturaId, clienteNombre, totalFactura, saldoPendiente) => {
        if (!historialPagosModal || !displayHistorialPagosFacturaId) return;
        displayHistorialPagosFacturaId.textContent = facturaId;
        displayHistorialPagosClienteNombre.textContent = clienteNombre || 'N/A';
        displayHistorialPagosTotalFactura.textContent = formatCurrency(totalFactura);
        displayHistorialPagosSaldoPendiente.textContent = formatCurrency(saldoPendiente);
        cuerpoTablaHistorialPagos.innerHTML = '';
        mensajeHistorialPagosModal.innerHTML = '';
        historialPagosLoading.style.display = 'block';
        historialPagosModal.show();
        try {
            const pagos = await cargarHistorialPagosFacturaAPI(facturaId);
            renderizarTablaHistorialPagos(pagos);
        } catch (error) {
            mostrarMensaje(mensajeHistorialPagosModal, 'Error al cargar el historial de pagos.', 'danger');
        } finally {
            historialPagosLoading.style.display = 'none';
        }
    };

    // --- INICIALIZACIÓN Y MANEJO DE SESIÓN ---

    const inicializarAplicacion = async (rol, mostrarMensajeCarga = true) => {
        console.log("[inicializarAplicacion] Iniciando inicialización de la aplicación.");
        currentUserRole = rol;
        sessionStorage.setItem('currentUserRole', rol);
        actualizarUIPorRol(rol);
        
        if (mostrarMensajeCarga) mostrarMensaje(mensajeGlobalContainer, 'Cargando datos de la aplicación...', 'info', 2000);
        
        if (resumenLoadingPlaceholder) resumenLoadingPlaceholder.style.display = 'flex';
        if (cuerpoTablaClientes) cuerpoTablaClientes.innerHTML = `<tr><td colspan="8" class="text-center p-3"><div class="spinner-border spinner-border-sm"></div>Cargando clientes...</td></tr>`;
        if (cuerpoTablaProveedores) cuerpoTablaProveedores.innerHTML = `<tr><td colspan="7" class="text-center p-3"><div class="spinner-border spinner-border-sm"></div>Cargando proveedores...</td></tr>`;
        if (cuerpoTablaCXC) cuerpoTablaCXC.innerHTML = `<tr><td colspan="9" class="text-center p-3"><div class="spinner-border spinner-border-sm"></div>Cargando CXC...</td></tr>`;
        
        try {
            if (mostrarMensajeCarga) {
                formNuevoProducto?.reset();
                if (formCliente) limpiarFormularioCliente();
                if (formProveedor) limpiarFormularioProveedor();
                if (formAjuste) { formAjuste.reset(); hiddenAjusteProductoId.value = ''; inputAjusteProducto.value = ''; }
                if (facturaFecha) facturaFecha.valueAsDate = new Date();
                if (inputFacturaCliente) inputFacturaCliente.value = "";
                if (hiddenFacturaClienteId) hiddenFacturaClienteId.value = "";
                if(selectFacturaCondicionPago) { selectFacturaCondicionPago.value = "contado"; if (facturaFechaVencimientoContainer) facturaFechaVencimientoContainer.style.display = 'none'; if(inputFacturaFechaVencimiento) inputFacturaFechaVencimiento.value = ''; }
                if (inputAjusteFecha) inputAjusteFecha.valueAsDate = new Date();
                actualizarCamposMovimiento();
                if (cuerpoTablaFacturaItems) cuerpoTablaFacturaItems.innerHTML = '';
                calcularTotalFactura();
                agregarFilaFactura();
                if (facturaCompraFecha) facturaCompraFecha.valueAsDate = new Date();
                if (inputFacturaCompraProveedor) inputFacturaCompraProveedor.value = "";
                if (hiddenFacturaCompraProveedorId) hiddenFacturaCompraProveedorId.value = "";
                if (cuerpoTablaFacturaCompraItems) cuerpoTablaFacturaCompraItems.innerHTML = '';
                calcularTotalFacturaCompra();
                agregarFilaFacturaCompra();
            }

            let productosParaDatalistResponse;
            let todosLosClientesResponse;
            let todosLosProveedoresResponse = { data: [] }; // Initialize with a default empty data structure

            console.log("[inicializarAplicacion] Fetching productos and clientes...");
            try {
                [productosParaDatalistResponse, todosLosClientesResponse] = await Promise.all([
                    fetchData('productos.php?todos=1'),
                    fetchData('clientes.php')
                ]);
                console.log("[inicializarAplicacion] Productos y clientes fetched.");
            } catch (error) {
                console.error("[inicializarAplicacion] Error fetching initial product/client data:", error);
                mostrarMensaje(mensajeGlobalContainer, `Error al cargar datos iniciales (productos/clientes): ${error.message}.`, 'danger', 10000);
                // Re-throw to stop initialization if core data fails
                throw error; 
            }

            console.log("[inicializarAplicacion] Fetching proveedores...");
            try {
                todosLosProveedoresResponse = await fetchData('proveedores.php');
                console.log("[inicializarAplicacion] Proveedores fetched.");
            } catch (error) {
                console.error("[inicializarAplicacion] Error fetching proveedores.php:", error);
                mostrarMensaje(mensajeGlobalContainer, `Error al cargar proveedores: ${error.message}. La tabla de proveedores podría no mostrarse.`, 'danger', 10000);
                // todosLosProveedoresResponse remains { data: [] } 
            }
            
            listaProductosGlobal = productosParaDatalistResponse?.data || [];
            listaClientesGlobal = todosLosClientesResponse?.data || [];
            listaProveedoresGlobal = todosLosProveedoresResponse?.data || [];
            
            console.log("[inicializarAplicacion] Populating datalists and rendering tables...");
            popularDatalistProductos(listaProductosGlobal);
            renderizarTablaClientes(listaClientesGlobal);
            renderizarTablaProveedores(listaProveedoresGlobal);
            popularDatalistClientesFactura(listaClientesGlobal);
            popularDatalistProveedoresFactura(listaProveedoresGlobal);
            popularFiltroClientesCXC(listaClientesGlobal);
            
            await renderizarResumen();
            await cargarYRenderizarInventario();
            await cargarYRenderizarHistorialMovimientos();
            await cargarYRenderizarHistorialFacturas();

            if (mostrarMensajeCarga) mostrarMensaje(mensajeGlobalContainer, 'Datos cargados correctamente.', 'success', 1500);
        } catch (initError) {
            console.error("Fallo en inicializarAplicacion:", initError);
            mostrarMensaje(mensajeGlobalContainer, `Error crítico al cargar datos: ${initError.message}.`, 'danger', 10000);
        } finally {
            if (resumenLoadingPlaceholder) resumenLoadingPlaceholder.style.display = 'none';
            // Ensure all loading indicators are removed
            if (cuerpoTablaClientes) cuerpoTablaClientes.innerHTML = '';
            if (cuerpoTablaProveedores) cuerpoTablaProveedores.innerHTML = '';
            if (cuerpoTablaCXC) cuerpoTablaCXC.innerHTML = '';
            // Re-render tables to show actual data or 'no records' message
            renderizarTablaClientes(listaClientesGlobal);
            renderizarTablaProveedores(listaProveedoresGlobal);
            renderizarTablaCXC(await cargarCXCAPI({})); // Reload CXC to ensure it's not stuck
        }
    };
    
    const mostrarMensajeLogin = (txt, tipo = 'danger') => {
        if (!loginMessage) return;
        loginMessage.innerHTML = `<div class="alert alert-${tipo} mt-3">${txt}</div>`;
        loginMessage.style.display = 'block';
    };

    const handleLogout = async () => {
        try {
            await fetchData('logout.php', { method: 'POST' });
            mostrarMensajeLogin('Cierre de sesión exitoso.', 'success');
            currentUserRole = null;
            sessionStorage.removeItem('currentUserRole');
            if (appContainer) appContainer.style.display = 'none';
            if (loginContainer) loginContainer.style.display = 'block';
            if (loginForm) loginForm.reset();
        } catch (error) {
            mostrarMensajeLogin('Error al cerrar sesión: ' + error.message, 'danger');
        }
    };

    const actualizarUIPorRol = (rol) => {
        currentUserRole = rol;
        const esAdmin = rol === 'Administrador';
        const esSoloLectura = rol === 'Solo Lectura';
        const puedeCrearFactura = esAdmin || !esSoloLectura;
        const puedeRegistrarPagos = esAdmin || rol === 'Cajero';

        document.querySelectorAll('#tab-carga, #tab-ajustes, #tab-datos').forEach(tab => tab.style.display = esAdmin ? '' : 'none');
        formNuevoProducto?.querySelectorAll('input,select,button').forEach(el => el.disabled = !esAdmin);
        formCliente?.querySelectorAll('input,select,button,textarea').forEach(el => el.disabled = !esAdmin);
        formAjuste?.querySelectorAll('input,select,button').forEach(el => el.disabled = !esAdmin);
        
        document.getElementById('tab-factura').style.display = puedeCrearFactura ? '' : 'none';
        formFactura?.querySelectorAll('input,select').forEach(el => el.disabled = !puedeCrearFactura);
        if (btnAddFacturaItem) btnAddFacturaItem.disabled = !puedeCrearFactura;
        if (btnGuardarFactura) btnGuardarFactura.disabled = !puedeCrearFactura;
        if (cuerpoTablaFacturaItems) cuerpoTablaFacturaItems.querySelectorAll('input,button').forEach(el => el.disabled = !puedeCrearFactura);
        
        if(tabCXCButton) tabCXCButton.style.display = puedeRegistrarPagos ? '' : 'none';

        document.getElementById('tab-factura-compra').style.display = puedeCrearFactura ? '' : 'none';
        formFacturaCompra?.querySelectorAll('input,select').forEach(el => el.disabled = !puedeCrearFactura);
        if (btnAddFacturaCompraItem) btnAddFacturaCompraItem.disabled = !puedeCrearFactura;
        if (btnGuardarFacturaCompra) btnGuardarFacturaCompra.disabled = !puedeCrearFactura;
        if (cuerpoTablaFacturaCompraItems) cuerpoTablaFacturaCompraItems.querySelectorAll('input,button').forEach(el => el.disabled = !puedeCrearFactura);

        const activeTabId = document.querySelector('#myTab .nav-link.active')?.dataset.bsTarget;
        const resumenTabButton = document.getElementById('tab-resumen');
        if (activeTabId === '#seccion-datos' && !esAdmin && resumenTabButton) new bootstrap.Tab(resumenTabButton).show();
    };

    const setupEventListeners = () => {
        loginForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (!username || !password) { mostrarMensajeLogin('Usuario y contraseña son requeridos.'); return; }
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Verificando...`;
            loginMessage.style.display = 'none';
            try {
                const response = await fetch(`${API_BASE_URL}/login.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
                const data = await response.json();
                if (data.success && data.data?.role) {
                    mostrarMensajeLogin('Login exitoso. Cargando aplicación...', 'success');
                    loginContainer.style.display = 'none';
                    appContainer.style.display = 'block';
                    await inicializarAplicacion(data.data.role, true);
                } else {
                    mostrarMensajeLogin(data.message || 'Credenciales incorrectas.');
                    document.getElementById('password').value = '';
                    document.getElementById('username').focus();
                }
            } catch (error) {
                mostrarMensajeLogin(`Error de conexión con el servidor: ${error.message}`);
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });

        logoutBtn?.addEventListener('click', handleLogout);

        themeToggleBtn?.addEventListener('click', () => {
            let newTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            updateThemeUI(newTheme);
        });

        document.querySelectorAll('#myTab button[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', event => {
                const activeTabId = event.target.dataset.bsTarget;
                const activeContent = document.querySelector(activeTabId);
                activeContent?.querySelector('[id^="mensaje-"]')?.remove();
                
                switch (activeTabId) {
                    case '#seccion-clientes': limpiarFormularioCliente(); break;
                    case '#seccion-proveedores': limpiarFormularioProveedor(); break;
                    case '#seccion-cxc': cargarYRenderizarCXC(); break;
                    case '#seccion-historial': aplicarFiltrosHistorialMov(); break;
                    case '#seccion-detalle-inventario': aplicarFiltrosInventario(); break;
                    case '#seccion-historial-facturas': aplicarFiltrosHistorialFact(); break;
                    case '#seccion-factura-compra': agregarFilaFacturaCompra(); break;
                }
            });
        });

        formNuevoProducto?.addEventListener('submit', agregarProducto);
        formAjuste?.addEventListener('submit', agregarMovimiento);
        formCliente?.addEventListener('submit', guardarOActualizarCliente);
        formProveedor?.addEventListener('submit', guardarOActualizarProveedor);
        
        selectAjusteTipo?.addEventListener('change', actualizarCamposMovimiento);
        btnAddFacturaItem?.addEventListener('click', agregarFilaFactura);
        btnGuardarFactura?.addEventListener('click', guardarFactura);
        btnAddFacturaCompraItem?.addEventListener('click', agregarFilaFacturaCompra);
        btnGuardarFacturaCompra?.addEventListener('click', guardarFacturaCompra);
        btnCancelarProveedorEdicion?.addEventListener('click', limpiarFormularioProveedor);
        btnConfirmarAnulacion?.addEventListener('click', confirmarAnulacionFactura);
        btnCancelarClienteEdicion?.addEventListener('click', limpiarFormularioCliente);
        btnAplicarFiltroCXC?.addEventListener('click', cargarYRenderizarCXC);
        limpiarFiltroCXCBtn?.addEventListener('click', () => {
            if(selectFiltroCXCCliente) selectFiltroCXCCliente.value = '';
            if(selectFiltroCXCEstado) selectFiltroCXCEstado.value = '';
            if(inputFiltroCXCFacturaId) inputFiltroCXCFacturaId.value = '';
            cargarYRenderizarCXC();
        });
        btnConfirmarPago?.addEventListener('click', confirmarRegistroPago);
        selectFacturaCondicionPago?.addEventListener('change', () => {
            if (facturaFechaVencimientoContainer && inputFacturaFechaVencimiento) {
                const esCredito = selectFacturaCondicionPago.value === 'credito';
                facturaFechaVencimientoContainer.style.display = esCredito ? 'block' : 'none';
                inputFacturaFechaVencimiento.required = esCredito;
                if (!esCredito) inputFacturaFechaVencimiento.value = '';
            }
        });

        inputAjusteProducto?.addEventListener('input', () => {
            hiddenAjusteProductoId.value = Array.from(datalistProductos.options).find(o => o.value === inputAjusteProducto.value)?.dataset.id || '';
        });
        inputFacturaCliente?.addEventListener('input', () => {
            hiddenFacturaClienteId.value = Array.from(datalistFacturaClientes.options).find(o => o.value === inputFacturaCliente.value)?.dataset.id || '';
        });
        inputFacturaCompraProveedor?.addEventListener('input', () => {
            hiddenFacturaCompraProveedorId.value = Array.from(datalistFacturaProveedores.options).find(o => o.value === inputFacturaCompraProveedor.value)?.dataset.id || '';
        });
        
        cuerpoTablaInventario?.addEventListener('click', (e) => {
            const deleteButton = e.target.closest('.btn-eliminar-producto');
            if (deleteButton && !deleteButton.disabled) eliminarProducto(parseInt(deleteButton.dataset.id, 10));
        });
        
        cuerpoTablaHistorial?.addEventListener('click', (e) => {
            const deleteButton = e.target.closest('.btn-eliminar-movimiento');
            const viewLink = e.target.closest('.link-ver-factura');
            if (deleteButton && !deleteButton.disabled) eliminarMovimiento(parseInt(deleteButton.dataset.id, 10));
            else if (viewLink) { e.preventDefault(); verFactura(parseInt(viewLink.dataset.id, 10)); }
        });
        
        cuerpoTablaHistorialFacturas?.addEventListener('click', e => {
            const target = e.target.closest('button');
            if (!target) return;
            const id = parseInt(target.dataset.id, 10);
            if (target.classList.contains('btn-ver-factura') || target.classList.contains('btn-ver-factura-anulada')) verFactura(id);
            else if (target.classList.contains('btn-anular-factura') && !target.disabled) abrirModalAnulacion(id);
            else if (target.classList.contains('btn-ver-historial-pagos')) {
                const { facturaId, clienteNombre, totalFactura, saldoPendiente } = target.dataset;
                abrirModalHistorialPagos(facturaId, clienteNombre, parseFloat(totalFactura), parseFloat(saldoPendiente));
            }
        });
        
        cuerpoTablaClientes?.addEventListener('click', e => {
            const target = e.target.closest('button');
            if (!target || target.disabled) return;
            const id = parseInt(target.dataset.id, 10);
            if (target.classList.contains('btn-editar-cliente')) cargarDatosClienteEnFormulario(id);
            else if (target.classList.contains('btn-toggle-activo-cliente')) toggleActivoCliente(id);
        });

        cuerpoTablaProveedores?.addEventListener('click', e => {
            const target = e.target.closest('button');
            if (!target || target.disabled) return;
            const id = parseInt(target.dataset.id, 10);
            if (target.classList.contains('btn-editar-proveedor')) cargarDatosProveedorEnFormulario(id);
            else if (target.classList.contains('btn-toggle-activo-proveedor')) toggleActivoProveedor(id);
        });
        
        cuerpoTablaCXC?.addEventListener('click', e => {
            const target = e.target.closest('button');
            if (!target) return;
            const { facturaId, clienteNombre, saldoActual, totalFactura } = target.dataset;
            if (target.classList.contains('btn-registrar-pago-cxc') && !target.disabled) abrirModalPago(facturaId, clienteNombre, parseFloat(saldoActual));
            else if (target.classList.contains('btn-ver-historial-pagos')) abrirModalHistorialPagos(facturaId, clienteNombre, parseFloat(totalFactura), parseFloat(saldoActual));
        });

        [filtroInventarioTexto, filtroInventarioESFechaInicio, filtroInventarioESFechaFin].forEach(el => el?.addEventListener('input', aplicarFiltrosInventario));
        filtroInventarioStock?.addEventListener('change', aplicarFiltrosInventario);
        limpiarFiltroInventarioBtn?.addEventListener('click', () => { [filtroInventarioTexto, filtroInventarioESFechaInicio, filtroInventarioESFechaFin].forEach(el => el.value = ''); filtroInventarioStock.value = ''; aplicarFiltrosInventario(); });
        inventarioLimitSelect?.addEventListener('change', (e) => { inventarioLimit = parseInt(e.target.value, 10); inventarioCurrentPage = 1; cargarYRenderizarInventario(); });
        inventarioBtnPrimera?.addEventListener('click', () => { if (inventarioCurrentPage > 1) { inventarioCurrentPage = 1; cargarYRenderizarInventario(); }});
        inventarioBtnAnterior?.addEventListener('click', () => { if (inventarioCurrentPage > 1) { inventarioCurrentPage--; cargarYRenderizarInventario(); }});
        inventarioBtnSiguiente?.addEventListener('click', () => { if (inventarioCurrentPage < inventarioTotalPages) { inventarioCurrentPage++; cargarYRenderizarInventario(); }});
        inventarioBtnUltima?.addEventListener('click', () => { if (inventarioCurrentPage < inventarioTotalPages) { inventarioCurrentPage = inventarioTotalPages; cargarYRenderizarInventario(); }});

        [filtroHistorialTexto, filtroHistorialFechaInicio, filtroHistorialFechaFin].forEach(el => el?.addEventListener('input', aplicarFiltrosHistorialMov));
        filtroHistorialTipo?.addEventListener('change', aplicarFiltrosHistorialMov);
        limpiarFiltroHistorialBtn?.addEventListener('click', () => { [filtroHistorialTexto, filtroHistorialFechaInicio, filtroHistorialFechaFin].forEach(el => el.value = ''); filtroHistorialTipo.value = ''; aplicarFiltrosHistorialMov(); });
        historialLimitSelect?.addEventListener('change', (e) => { historialMovimientosLimit = parseInt(e.target.value, 10); historialMovimientosCurrentPage = 1; cargarYRenderizarHistorialMovimientos(); });
        historialBtnPrimera?.addEventListener('click', () => { if (historialMovimientosCurrentPage > 1) { historialMovimientosCurrentPage = 1; cargarYRenderizarHistorialMovimientos(); }});
        historialBtnAnterior?.addEventListener('click', () => { if (historialMovimientosCurrentPage > 1) { historialMovimientosCurrentPage--; cargarYRenderizarHistorialMovimientos(); }});
        historialBtnSiguiente?.addEventListener('click', () => { if (historialMovimientosCurrentPage < historialMovimientosTotalPages) { historialMovimientosCurrentPage++; cargarYRenderizarHistorialMovimientos(); }});
        historialBtnUltima?.addEventListener('click', () => { if (historialMovimientosCurrentPage < historialMovimientosTotalPages) { historialMovimientosCurrentPage = historialMovimientosTotalPages; cargarYRenderizarHistorialMovimientos(); }});

        [filtroFacturasTexto, filtroFacturasFechaInicio, filtroFacturasFechaFin, filtroFacturasEstadoPago, filtroFacturasVerAnuladas].forEach(el => el?.addEventListener('input', aplicarFiltrosHistorialFact));
        [filtroFacturasEstadoPago, filtroFacturasVerAnuladas].forEach(el => el?.addEventListener('change', aplicarFiltrosHistorialFact));
        
        limpiarFiltroFacturasBtn?.addEventListener('click', () => {
            if(filtroFacturasTexto) filtroFacturasTexto.value = '';
            if(filtroFacturasFechaInicio) filtroFacturasFechaInicio.value = '';
            if(filtroFacturasFechaFin) filtroFacturasFechaFin.value = '';
            if(filtroFacturasEstadoPago) filtroFacturasEstadoPago.value = '';
            if(filtroFacturasVerAnuladas) filtroFacturasVerAnuladas.checked = false;
            aplicarFiltrosHistorialFact();
        });

        histfactLimitSelect?.addEventListener('change', (e) => { histFacturasLimit = parseInt(e.target.value, 10); histFacturasCurrentPage = 1; cargarYRenderizarHistorialFacturas(); });
        histfactBtnPrimera?.addEventListener('click', () => { if (histFacturasCurrentPage > 1) { histFacturasCurrentPage = 1; cargarYRenderizarHistorialFacturas(); }});
        histfactBtnAnterior?.addEventListener('click', () => { if (histFacturasCurrentPage > 1) { histFacturasCurrentPage--; cargarYRenderizarHistorialFacturas(); }});
        histfactBtnSiguiente?.addEventListener('click', () => { if (histFacturasCurrentPage < histFacturasTotalPages) { histFacturasCurrentPage++; cargarYRenderizarHistorialFacturas(); }});
        histfactBtnUltima?.addEventListener('click', () => { if (histFacturasCurrentPage < histFacturasTotalPages) { histFacturasCurrentPage = histFacturasTotalPages; cargarYRenderizarHistorialFacturas(); }});

    };

    const updateThemeUI = (theme) => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    };

    // --- Arranque de la Aplicación ---
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    updateThemeUI(storedTheme || (prefersDark ? 'dark' : 'light'));
    
    setupEventListeners();
    actualizarCamposMovimiento();

    const storedRole = sessionStorage.getItem('currentUserRole');
    if (storedRole && appContainer && loginContainer) {
        appContainer.style.display = 'block';
        loginContainer.style.display = 'none';
        inicializarAplicacion(storedRole, true);
    } else {
        if (appContainer) appContainer.style.display = 'none';
        if (loginContainer) loginContainer.style.display = 'block';
    }
});
