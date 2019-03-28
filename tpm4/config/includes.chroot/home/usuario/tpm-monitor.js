const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;

const EVT_UNKNOWN = '0';
const EVT_CONNECTED_INACTIVE = '1';
const EVT_DISCONNECTED_INACTIVE_URI = '2';
const EVT_ABOUT_EXPIRE = '3';
const EVT_DISCONNECTACTIVE = '4';
const EVT_DOWNLOADING = '5';
const EVT_PERMANENT = '6';
const EVT_PROTECTED = '7';
const EVT_UPGRADING = '8';

let count = 0;

const TDIface = '<node> \
<interface name="com.intel.cmpc.td.client"> \
    <method name="GetInfo"> \
        <arg direction="out"  type="a{ss}" /> \
        <arg direction="in" type="s" /> \
    </method> \
    <method name="OnMenuItemClick"> \
        <arg direction="in" type="s" /> \
    </method> \
    <method name="GetMenuItemInfo"> \
        <arg direction="in" type="s" /> \
        <arg direction="out" type="a{ss}" /> \
    </method> \
    <signal name="TDInfoChanged"> \
        <arg direction="out" type="a{ss}" /> \
    </signal> \
</interface> \
</node>';

Gtk.init(null);

//Create the remote object, based on the correct parh and bus name
const TDProxy = Gio.DBusProxy.makeProxyWrapper(TDIface);

const TDclient = new TDProxy(Gio.DBus.session, 'com.intel.cmpc.td.client','/com/intel/cmpc/td/client');

//Set the delegate to the TDInfoChanged Event
TDclient.connectSignal("TDInfoChanged", TDInfoChanged);

print ("Iniciando TPM Monitor...");

function TDInfoChanged(proxy, sender, msg)
{
    if (msg == null)
        return;

    print ("Estado: " + msg[0].id);
    print ("MSG: " + msg[0].message);
    print ("HDR: " + msg[0].header);
    print ("Evt count:" + count);

    if (msg[0].id == EVT_UNKNOWN ||
        msg[0].id == EVT_CONNECTED_INACTIVE ||
        msg[0].id == EVT_DISCONNECTED_INACTIVE_URI ||
        msg[0].id == EVT_DISCONNECTACTIVE) {
        print ("Problemas de conexion. Ignorando evento");
        return;
    }

    count = count + 1;

    if (msg[0].message.indexOf("2020") !== -1) {
        aviso.show();
        print ("Certificado aplicado. Apagando el equipo");
        //GLib.spawn_command_line_sync('sudo poweroff');
    }
    else if (count >= 4) {
        print ("Reiniciando para aplicar certificado.");
        GLib.spawn_command_line_sync('sudo reboot');
    }

}

let aviso = new Gtk.MessageDialog ({
    modal: true,
    buttons: Gtk.ButtonsType.OK,
    message_type: Gtk.MessageType.WARNING,
    text: "Certificado aplicado, el equipo se apagará." });

aviso.connect('response', (this, _response_cb.bind(this)));

function _response_cb (dialog, response_id)
{
    switch (response_id) {
        case Gtk.ResponseType.OK:
            print ("Certificado aplicado. Apagando el equipo.");
            GLib.spawn_command_line_sync('sudo poweroff');
            break;
        case Gtk.ResponseType.DELETE_EVENT:
            print ("Dialog closed or cancelled.\n");
            aviso.hide();
            break;
    }
}

Gtk.main();